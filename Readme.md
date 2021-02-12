# jGaphics

<img src="https://img.shields.io/badge/Git version-0.0.1-yellowgreen"/> <img src="https://img.shields.io/github/languages/top/devGnode/jgraphics"/> 

## Preamble

Why make this, in real this it to have no usage, just  

## Techno

- nodeJs
- Typescript
- require ( same of requireJS )

## Set-up / Build

- `npm install`
- `npm run amd:build:prod`

After to have build this project with npm command, compiled project will be in `prod-web` directory.
To run it you need to be in a real server environment because **XMLHttpRequest** is used for get libraries from the server, and then open `index.html`.


## Test File

Directory : `Test/`

- Ginit ***( current develop test file )***
- BorderLayoutTest
- BoxLayoutTest
- FlowLayoutTest
- LayoutScroll
- LayoutTest

````typescript
BorderLayoutTest.main(0,["/Test/BorderLayoutTest.js"]);
FlowLayoutTest.main(0,["/Test/FlowLayoutTest.js"]);
BoxLayoutTest.main(0,["/Test/BoxLayoutTest.js"]);
LayoutTest.main(0,["/Test/LayoutTest.js"]);
LayoutScroll.main(0,["/Test/LayoutScroll.js"]);
````
## Render 

|  | Window Render    |  |
| :--------------- |:---------------:| -----:|
|   |<img src="https://i.ibb.co/vdk7QB5/framerender.png">| |

## Libraries

- Glib

<img src="https://i.ibb.co/ysXscpR/Untitled-Diagram-Page-3-2.png" alt="Untitled-Diagram-Page-3-2">

## prod

- index 
- prod-web
