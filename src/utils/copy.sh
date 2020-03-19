#!/bin/sh
cd /Users/chenyu/Downloads/mycode/node/imooc/myCode/blog1/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" >  access.log