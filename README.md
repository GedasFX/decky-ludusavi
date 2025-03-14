# Decky - Ludusavi

This plugin is a Decky adapter for the [Ludusavi](https://github.com/mtkennerly/ludusavi) project. For more information on how to use that tool, visit their GitHub page.

This plugin is similar to [decky-cloud-save](https://github.com/GedasFX/decky-cloud-save), however this one proudly supports bi-directional sync! 
* Note: Linux/Windows interoperability requires further testing/documentation, help is welcome.

Backup and Restore your files from local storage, Dropbox, Google Drive, OneDrive, FTP, SMB, WebDAV, and other providers!

## Requirements / Installation

To run this plugin, you MUST have Ludusavi installed seperately on your Steam Deck. You can either install a flatpak from 'Discover', or have a binary (and have it in PATH).

After you have Ludusavi installed, make sure to open it and configure it. Quick overview of what needs to be configured:

* BACKUP MODE
   * Click Preview and scan for large games. Exclude files by unchecking the checkbox form backups.
   * Configure quantity of full & differential backups, and the format. I highly reccommend having more than one full/differential backups, so you have versioning of your saves!
* RESTORE MODE
   * Nothing here really, familiarize with this view, as this will be the place where you would restore your backups from
* CUSTOM GAMES
   * If you have games that are not PC games (e.g. emulation), you may need to add paths to the games here.
* OTHER
   * Cloud - Set path to Rclone (download if needed), and set up your remote. Here you can specify the folder name if needed. Here you will also find a button to pull files from remote. This button will later be added to the Decky UI (https://github.com/GedasFX/decky-ludusavi/issues/3).
   * Backup Exclusions - If some paths need to be excluded no matter what, set them here.

## Troubleshooting

The plugin should provide a log of all events in `/home/deck/homebrew/logs/Ludusavi`. Check `api_calls.log` for Ludusavi errors, and all other files, for all issues. Feel free to open an issue if you still need help.

## Features

* Ability to sync game saves or arbitrary files to the cloud.
* Bi-directional sync support (Linux/Windows needs proper docs).
* Backup stats after each sync (duration/size).
* Per-instance configuration (for save locations, and if it should auto backup or not).
* Support for off-brand names (some games add GOTY to game title, so bacup solutions that do not expect such name break, we have support to change that name so Ludusavi recognises this game).
* Support for backup of single folder for multiple games (rename both games to some common name, and specify that in customs folder).

## Tutorials

I recognise this Ludusavi is a complex tool to get started on. And while I tried my best to make the experience as user friendly as possible, some aspects are likely to be unclear. Please open an issue if you have troubles setting anything up, and hopefully someone from the community can make a guide on this specific topic.

### Guides:

* Setting up Windows/Linux sync (Help Wanted! https://github.com/GedasFX/decky-ludusavi/issues/1)
* Setting up paths in CUSTOM GAMES for emulation (Help Wanted! https://github.com/GedasFX/decky-ludusavi/issues/2)

## Acknowledgments

* [Decky Loader](https://github.com/SteamDeckHomebrew/decky-loader)
* [Ludusavi](https://github.com/mtkennerly/ludusavi)