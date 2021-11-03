#!/usr/bin/env node
import { program } from 'commander';
import { checkTsconf } from './index';

program.parse(process.argv);

if (program.args[0]) {
    checkTsconf(program.args[0]);
}
