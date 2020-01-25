#!/usr/bin/node




const app = require('commander');
const { promisify } = require('util');
const fs = require('fs');
const readFile = promisify(fs.readFile);


import { version }           from '../../package.json';
import { fsl_to_svg_string } from 'jssm-viz';

import * as sharp            from 'sharp';
import { file_type }         from './types';


// app.on('option:verbose', function () { process.env.VERBOSE = this.verbose; })

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

if (app.debug) console.log(app.opts());

const sourceFsl = app.source



async function render(fsl_code: string): Promise<string> {

  const svg_code: string = await fsl_to_svg_string(fsl_code);

  return svg_code;

}

async function render_to_png(fsl_code: string) {
  if (app.png === undefined) { console.log('we need a filename')} 
  const svg_code = await render(fsl_code);
  sharp(svg_code).toFile(app.png)
}



async function run() {
  // const fsl = readFile('./traffic-light.fsl');
  // fsl_to_svg_string(fsl).then((svg) => {
    // return sharp(svg).png().toFile(app.png)
  // });
  console.log(await render(`

machine_name: "Traffic light example";

Green 'next' => Yellow 'next' => Red 'next' => Green;
[Red Yellow Green] ~> Off -> Red;

  `));
}





run();
