#!/usr/bin/env node
import { program } from 'commander';
import { main } from './index';

program.parse(process.argv);

if (program.args[0]) {
    main(program.args[0]);
}
