import fs from 'fs';

const isFileEmpty = (filePath: string) => {
    try {
      const stats = fs.statSync(filePath);
      return stats.size === 0;
    } catch (err) {
      console.error('Error checking file:', err);
      return false;
    }
};

export default isFileEmpty;