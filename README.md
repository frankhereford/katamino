* [x] update object locally to get quicker ui
  * [x] don't refetch until some seconds of inactivity then fetch
* [x] add visibility indicator
* [x] make blocks transform, but not translate
* [x] show mini penta boards on listing page
* [x] detect success and show a gold star or confetti burst or something
  * [ ] update the favicon with a react-use hook
  * [x] fix this so it's exactly the screen dimensions
* [ ] add a reset all button
* [x] show keys to hint the controls
* [x] fix small board bugs
  * look at when you have overlaps on a tiny penta preview
* [ ] make a block clickable
* [x] use an icon not a broken image when not logged in
* [x] add github login option if in production
  * [ ] bonus points for /only/ in production?
* [x] if hidden, don't allow moves on a block
* [ ] look for places where things wrap and use the modulo operator
* [ ] hook up navbar login/logout
* [ ] make the <buttons> into a component
* [ ] track lineage of user pentas and show a star for completion on availablePentas
* [ ] Do the CI to break production off into a thing
  * [ ] Integrate DB allocation for PR branches
* [ ] add version in footer
* [ ] let users hide pentas in their list of their pentas

Stuff I want to demo:
* TailwindCSS - bootstrap but 🍄, like very-🍄
  * daisyUI
* prisma - schema and migrations
* typescript
* vercel + railway (analytics!)