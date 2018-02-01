# Changelog

## v.0.7

- Changed title screen
- Change game name to "Fractured Flicks"
- Pieces now rotate at 180-degree intervals instead of 90 to streamline gameplay
- Changed production deployment process to use push-dir

## v.0.6

- Added pause menu
- Game saves best completion times to local storage
- Moved main videos to AWS S3 servers

## v.0.5

- Added Puzzle select screen
- UI elements are now drawn on top of pieces

## v.0.4

- Added title screen

## v.0.3

- Added sound effects and background music
- Changed control scheme to only require a single-button mouse or touchscreen
- Can switch between different puzzles
- Replaced black-and-white filter in guide with a simple darkening tint to improve performance on lower-end machines
- Added background and frame graphics
- Replaced FPS Counter with one from stats.js

## v.0.2

- Removed frameskip. Game now runs at an uncapped frame rate
- Swapped outline filter on pieces with a simple rectangular outline drawn with PIXI.Graphics to improve performance
- When the puzzle is complete, all pieces are now hidden and the black and white filter is removed from the guide. This
was done to remove redundancy and improve performance
- Canvas is now responsive to the size of the window/display
- Fixed a bug where a piece would be considered in the correct place even if it was in the wrong orientation
- Fixed a bug where a piece would not be considered in the correct place if it was rotated beyond 360 degrees

## v.0.1

- First public release
