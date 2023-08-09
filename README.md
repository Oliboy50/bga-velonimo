# bga-velonimo

> Board Game Arena adaptation of a card game named Velonimo

## Reminders

### Create sprite of cards

- Create sprite from 180px wide PNG card images:
  ```shell
  magick montage $(ls blue-*.png) $(ls brown-*.png) $(ls gray-*.png) $(ls green-*.png) $(ls pink-*.png) $(ls red-*.png) $(ls yellow-*.png) $(ls special-*.png) back-ext_legendes.png $(ls adventurer-*.png) -geometry +0+0 -tile 7x9 -mode concatenate -background none cards.png
  ```
- Create finish.png sprite from 150x150 finish images:
  ```shell
  magick montage $(ls finish_*.png) -geometry +0+0 -tile 4x1 -mode concatenate -background none finish.png
  ```
- Reduce generated sprite size by ~90% (using https://tinypng.com or https://compresspng.com if the file is too large)

## License

### Original board game

See [Velonimo on BoardGameGeek](https://boardgamegeek.com/boardgame/323262/velonimo) to see who designed/published the original card game.

### Board Game Arena adaptation (this repository)

What is contained in the first git commit is licensed under [LICENCE_BGA](LICENCE_BGA) file (this is the source code generated by the Board Game Arena framework).

The images (in `img`) come from the original game design which is the property of the [Velonimo game designers](https://boardgamegeek.com/boardgame/323262/velonimo).
The usage of these images in this project is done with the agreement of the Velonimo game publisher ([Stratosphères](https://www.studiostratospheres.com)).

The game interface is inspired from [bga-papayoo](https://github.com/Syarwin/bga-papayoo).

The rest is licensed under GPLv3, credits go to the git commits author. - See [LICENSE.md](LICENSE.md) file.
