#!/usr/bin/node

let DEBUG = false;




import { version }           from '../../package.json';

import * as sharp            from 'sharp';
import { image_file_type, raw_file_type, fsl_file_type, viz_file_type  } from './types';
import { fsl_to_svg_string, fsl_to_dot } from 'jssm-viz';
import * as util             from 'util';
import { readFile }          from 'fs';

const readFileAsync     =    util.promisify(readFile);

const app               =    require('commander');




app
  .version(version)
  .option('-d --debug',               'Output extra debugging info')
  .option('-s, --source <glob>',      'The input source file, as a glob, such as foo.fsl or ./**/*.fsl')
  .option('--svg <default>',          'Produce output in SVG format (default if no formats specified)')
  .option('--png',                    'Produce output in PNG format')
  .option('--jpg',                    'Produce output in JPEG format, with a .jpg extension')
  .option('--jpeg',                   'Produce output in JPEG format, with a .jpeg extension')
  .option('--gif',                    'Produce output in GIF format')
  .option('--webp',                   'Produce output in WEBP format')
  .option('-w, --width <integer>',    'Set raster render width, in pixels')
  .option('--tree',                   'Produce output in JSSM\'s internal parse tree format, with a .tree extension')
  .option('--dot',                    'Produce output in GraphViz\'s DOT format')
  .option('--inplace <default>',      'Output where source was found')
  .option('--todir <dir>',            'Output to a specified directory')
  .option('--toinplacedir <dir>',     'Output a matching tree from source to a specified directory')
  .option('--tosourcenameddir <dir>', 'Output slugged names to a specified directory');

app.parse(process.argv)




function hasOutputOptions(app) {
  return app.png || app.webp || app.jpeg || app.jpg || app.tree || app.dot || app.svg || app.gif; 
}


async function render(fsl_code: string): Promise<string> {
  const svg_code: string = await fsl_to_svg_string(fsl_code);
  return svg_code;
}


async function run() {

  if (app.debug) {
    console.log(app.opts());
    DEBUG = true;
  }

  if (!hasOutputOptions(app)) {
    console.error('Output type must be specified!');
    process.exit(-1);
  }

  const svg_code  = await render(readFileAsync(app.source).toString());
  
  const outFile = app.source.replace('fsl', raw_file_type);

  if (app[raw_file_type]) {
    fs.writeFile(outFile, svg_code );
  }


  if (app[image_file_type]) {
    sharp()
  } 


  // const fsl = readFile('./traffic-light.fsl');
  // fsl_to_svg_string(fsl).then((svg) => {
    // return sharp(svg).png().toFile(app.png)
  // });
  /*
  console.log(await render(`

machine_name: "Traffic light example";

Green 'next' => Yellow 'next' => Red 'next' => Green;
[Red Yellow Green] ~> Off -> Red;

  `));
  */
}





run();


async function render_to_png(fsl_code: string) {
  if (app.png === undefined) { console.log('we need a filename')} 
  const svg_code = await render(fsl_code);
  sharp(svg_code).toFile(app.png)
}
