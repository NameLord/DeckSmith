<div align="center">
  <img src="https://raw.githubusercontent.com/willis81808/DeckSmith/main/assets/icon.png" width="250px" style="user-select: none;" />
  <h1>DeckSmith</h1>
  Unleash your creativity and craft custom card mods with ease, bringing your unique strategies and styles to life in the world of ROUNDS without writing a single line of code.
</div>

<br>

## Install

Clone the repo and install dependencies:

```bash
git clone https://github.com/willis81808/DeckSmith.git
cd DeckSmith
npm install
```

or install a prebuilt [release](https://github.com/willis81808/DeckSmith/releases).

## Setup

DeckSmith requires the .NET SDK to be installed and certain Unity assemblies and mod dependencies to be referenced to successfully build/export your mod. I recommend the following steps:

1. Install the [.NET SDK](https://dotnet.microsoft.com/en-us/download)
1. Create a `Libs` folder somewhere memorable, but out of the way.
1. Copy the following files from `${ROUNDS_INSTALL_DIR}/Rounds_Data/Managed` to your `Libs` folder:
    - `Assembly-CSharp.dll`
    - `UnityEngine.dll`
    - `UnityEngine.CoreModule.dll`
1. Move the BepInEx assemblies to your `Libs` folder:
    - Open r2modman or Thunderstore Mod Manager, select one of your ROUNDS profiles
    - Open Settings > Locations and click "Browse profile folder"
    - Inside you will see a folder called `BepInEx`, open it, then open the `core` folder within it
    - Copy `0Harmony.dll` and `BepInEx.dll` into your `Libs` folder
1. Download [UnboundLib](https://rounds.thunderstore.io/package/willis81808/UnboundLib/) and copy `UnboundLib.dll` to your `Libs` folder.
1. Download [ModsPlus](https://rounds.thunderstore.io/package/willis81808/ModsPlus/) and copy `ModsPlus.dll` to your `Libs` folder.
1. Download [ModdingUtils](https://rounds.thunderstore.io/package/Pykess/ModdingUtils/) and copy `ModdingUtils.dll` to your `Libs` folder.
1. Download [DeckSmithUtil](https://rounds.thunderstore.io/package/willis81808/DeckSmithUtil/) and copy `DeckSmithUtil.dll` to your `Libs` folder.
1. Download [Jarl Library](https://thunderstore.io/c/rounds/p/AALUND13/JARL/) and copy `JARL.dll` to your `Libs` folder.
1. Launch DeckSmith and configure your `Libs` folder path as the "Library Folder" under Mod Configuration
1. Start creating!

Ultimately the contents of your `Libs` folder should look like this:

<img src="https://raw.githubusercontent.com/willis81808/DeckSmith/main/assets/images/example-library-folder.png" />

## Starting Development

Start the app in the `dev` environment:

```bash
npm start
```

## Packaging for Production

To package apps for the local platform:

```bash
npm run package
```
