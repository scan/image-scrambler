# Image Scrambler

Highly specialised tool to scramble images from an input folder into an output folder.

## Installing dependencies

You need `node` and `yarn` to be present on the system. With MacOS, install via `brew`:

```bash
brew install node@20 yarn
```

After installation, go into folder and execute the script:

```
yarn install
```

This installs the required dependencies.

## Usage

The script requires the presence of an `input` and `output` folder. `output` will be created if not present.

`input` expects there to be a number of subfolders, which in turn contain the iamges to be scrambled. The list of subfolders is sorted alphabetically, and then the output is created in the following pattern:

```
input/01 input/02 input/03 input/04 ->
output/0101.png
output/0201.png
output/0301.png
output/0401.png
output/0302.png
output/0202.png
output/0102.png
output/0203.png
# etc...
```

The files are then renamed into a pattern like `0001.png` to create one sequence of images that can be picked up by the next program.

## Supported extensions

By default, the script will only be looking for files with the following extensions:

```
jpg jpeg png exr tif tiff
```

This can be changed in the script by adding to the const `FILE_EXTENSIONS`.

Accordingly, `INPUT_DIR_NAME` and `OUTPUT_DIR_NAME` can be changed if another name is desired. Please be aware that the directories are always taken as relative from where the script is executed.

## Caveats

The script will not clear the `output` folder if run again. The user is responsible to make sure their prior work is moved and not overridden.

The script will _copy_ the files, meaning the total file size on disk will double upon execution. Be careful when using it for very lage files.

This script is very janky and should not be used in a professional setup.