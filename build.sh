#!/bin/bash
set -e
npx ng build 
cp index.html dist/learn-how-to-type/browser/
cp og_img_1.png dist/learn-how-to-type/browser/
sed -i 's@Learn how to type with your 10 fingers without looking at the keyboard. learn-how-to-type is a free web application.@Apprenez à taper avec vos 10 doigts sans regarder le clavier. learn-how-to-type est une application gratuite.@g' dist/learn-how-to-type/browser/fr/index.html
sed -i 's@Learn how to type@Apprenez à taper au clavier@g' dist/learn-how-to-type/browser/fr/index.html
sed -i 's@learn-how-to-type.com/en/@learn-how-to-type.com/fr/@g' dist/learn-how-to-type/browser/fr/index.html
sed -i 's@en_US@fr_FR@g' dist/learn-how-to-type/browser/fr/index.html
today=`date +'%F'`
sed -i "s@2023-12-10@$today@g" dist/learn-how-to-type/browser/fr/index.html
sed -i "s@2023-12-10@$today@g" dist/learn-how-to-type/browser/en/index.html
