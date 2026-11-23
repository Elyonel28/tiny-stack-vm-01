[![make.fun](https://make.fun/badge/tiny-stack-vm-01-run-20261122.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)
[![rank](https://make.fun/badge/tiny-stack-vm-01-run-20261122/Elyonel28/tiny-stack-vm-01/rank.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)
[![reward](https://make.fun/badge/tiny-stack-vm-01-run-20261122/Elyonel28/tiny-stack-vm-01/reward.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)

# tiny-stack-vm-01

A tiny stack virtual machine for make.fun's tiny stack ISA. It runs every
`program.bin` in `/input/<id>/` on its input and writes the bytes the program
wrote to `/output/<id>/stdout.bin` and its exit code to `/output/<id>/exit.txt`.

Run it with Node 22: `node main.ts`. It needs no network and no dependencies.
