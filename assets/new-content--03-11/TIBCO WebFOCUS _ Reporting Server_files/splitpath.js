/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/

/**
 * 
 * @param {String} fullPath - the path that will be split on the forward slash separator
 * @param {boolen} isFile - optional - force the path to be parsed as the last token is a file, even when no extension 
 * @returns {Object} - and object with members for each part of the split path
 */
const splitPath = (fullPath, isFile) => {
    const ret = {
        'fullPath': fullPath, // full path, as passed in
        'pathOnly': fullPath, // path without file
        'folder': '', // parent folder of file
        'ext': '', // file extension
        'fullFileName': '', // file name + extension
        'fileName': '', // file name without extension
        'fullWfirsPath': '', // full wfirs path
        'wfirsPath': '', // wfirs path without file name
    };
    const slashIndex = fullPath.lastIndexOf('/');
    let dotIndex = fullPath.lastIndexOf('.');
    if (slashIndex != -1 && dotIndex < slashIndex) // Dot is part of the path, not extension
        dotIndex = -1;
    if (isFile && -1 == dotIndex) {
        // assume file name doesn't have a dot
        dotIndex = fullPath.length;
    }

    if (dotIndex > 0) {
        ret.ext = fullPath.substring(dotIndex + 1);
        if (slashIndex >= 0) {
            ret.fullFileName = fullPath.substring(slashIndex + 1);
            ret.fileName = fullPath.substring(slashIndex + 1, dotIndex);
            ret.pathOnly = fullPath.substring(0, slashIndex);
            if (ret.fullFileName != ret.pathOnly) {
                var folderSlash = ret.pathOnly.lastIndexOf('/');
                ret.folder = ret.pathOnly.substring(folderSlash + 1);
            }
        }
        else {
            ret.fullFileName = fullPath;
            ret.fileName = fullPath.substring(0, dotIndex);
            ret.pathOnly = '';
        }
    }
    ret.wfirsPath = ret.pathOnly.replace(":", "");
    ret.fullWfirsPath = ret.fullPath.replace(":", "");
    return ret;
};

if (typeof module === 'object')
    module.exports = splitPath;
