# Decky - Ludusavi

This plugin is a Decky adapter for the [Ludusavo](https://github.com/mtkennerly/ludusavi) project. For more information on how to use that tool, visit their GitHub page.

This plugin is similar to [decky-cloud-save](https://github.com/GedasFX/decky-cloud-save), however thisone proudly supports bi-directional sync! 
* Note: Linux/Windows interoperability requires further testing/documentation, help is welcome.

Backup and Restore your files from local storage, Dropbox, Google Drive, OneDrive, FTP, SMB, WebDAV, and other providers!

## Requirements

To run this plugin, you MUST have Ludusavi installed seperately on your Steam Deck. You can either install a flatpak from 'Discover', or have a binary (and have it in PATH). 

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

* Setting up Windows/Linux sync (Wanted!)

## Acknowledgments

* [Decky Loader](https://github.com/SteamDeckHomebrew/decky-loader)
* [Ludusavi](https://github.com/mtkennerly/ludusavi)