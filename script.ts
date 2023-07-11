import { copyFile, readdir, lstat, mkdir } from 'fs/promises';
import { resolve, join, extname } from 'path';

const isDirectory = async (path: string): Promise<boolean> => {
  try {
    return (await lstat(path)).isDirectory();
  } catch (e) {
    return false;
  }
};

const dirEntries = async (f: string) =>
  (await readdir(f)).map((item) => join(f, item));

async function filter<T>(
  arr: Array<T>,
  callback: (item: T) => Promise<boolean>
): Promise<Array<T>> {
  const fail = Symbol();
  // @ts-ignore
  return (
    await Promise.all(
      arr.map(async (item) => ((await callback(item)) ? item : fail))
    )
  ).filter((i: T | typeof fail): i is T => i !== fail);
}

const pad = (num: number, size: number): string => {
  let res = num.toString();
  while (res.length < size) {
    res = '0' + res;
  }
  return res;
};

const areAllEmpty = <T>(lst: Array<Array<T>>): boolean => {
  for (const l of lst) {
    if (l.length > 0) {
      return false;
    }
  }
  return true;
};

const main = async () => {
  const outputDir = resolve('.', 'output');
  const inputDir = resolve('.', 'input');

  if (!isDirectory(inputDir)) {
    console.error(
      `Expected ${inputDir} to be a directory and contain input directories.`
    );
    return;
  }

  const inputDirs = (
    await filter(await dirEntries(inputDir), isDirectory)
  ).sort();
  if (inputDirs.length === 0) {
    console.error(`Found no inputs in ${inputDir}`);
    return;
  }

  console.log('Going with these input dirs in this order:');
  inputDirs.forEach((entry) => console.log(`\t - ${entry}`));

  if (!(await isDirectory(outputDir))) {
    console.log(`could not found output dir at ${outputDir}, creating...`);
    await mkdir(outputDir);
  }

  const listOfLists: Array<Array<string>> = await Promise.all(
    inputDirs.map(async (dir) => {
      const images = (await dirEntries(dir)).filter((fileName) =>
        ['.jpg', '.jpeg', '.png', '.ext'].includes(extname(fileName))
      );
      return images;
    })
  );

  const fileList: Array<string> = [];

  // Until we have emptied all the input lists
  while (!areAllEmpty(listOfLists)) {
    // Go through the list top-down
    for (let i = 0; i < listOfLists.length; i++) {
      const dir = listOfLists[i];
      const elem = dir.shift();
      if (elem) {
        fileList.push(elem);
      }
    }

    // Go through the list backwards, skipping first and last
    for (let i = listOfLists.length - 2; i > 0; i--) {
      const dir = listOfLists[i];
      const elem = dir.shift();
      if (elem) {
        fileList.push(elem);
      }
    }
  }

  const magnitude = Math.ceil(Math.log10(fileList.length));
  const promises: Array<Promise<void>> = [];

  for (let i = 0; i < fileList.length; i++) {
    const entry = fileList[i];
    const newName = join(outputDir, `${pad(i, magnitude)}${extname(entry)}`);

    promises.push(copyFile(entry, newName));
  }

  await Promise.all(promises);
};

main().then(() => console.log('done'));
