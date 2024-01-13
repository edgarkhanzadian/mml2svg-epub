# filename with .epub extension
epubFile=$1
# filename without .epub extension
epub="${epubFile%.*}"

# unzip the file
zip -FF $epubFile --out tmpFile.epub
unzip tmpFile.epub -d $epub
chmod -R 755 $epub
rm -rf tmpFile.epub

node index.js $epub
# filename with New tag and .epub extension
newEpubFile=$epub-New.epub

# zip that file
zip -X0 $newEpubFile $epub/mimetype 
zip -rDX9 $newEpubFile $epub/* -x "*.DS_Store" -x mimetype

rm -rf $epub