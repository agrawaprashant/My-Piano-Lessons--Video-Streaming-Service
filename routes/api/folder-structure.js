const express = require('express');
const router = express.Router();
const fs= require('fs');
const path = require('path');

function getDirTree(dirPath) {
    const stats = fs.lstatSync(dirPath);
    const info =  {
        path: dirPath,
        name: path.basename(dirPath)
    }

    if(stats.isDirectory()) {
        info.type = "folder";
        info.children = fs.readdirSync(dirPath).map((child) => {
            return getDirTree(dirPath + '/' + child);
        })
    } else {
        const ext = path.extname(dirPath);
        if (ext.includes('.mp4')) {
            info.thumbnail = 'https://c7.uihere.com/files/943/996/896/acoustic-black-and-white-classic-classical-music-thumb.jpg'
        }
        info.path = dirPath.split('/').join('$')
        info.type = 'file';
    }

    return info;
}

router.get('/folder-structure', (req,res) => {
   return res.json(getDirTree('C:/Users/Prashant Agarwal/Downloads/Pianoforall - Incredible New Way To Learn Piano & Keyboard'))
})


module.exports = router