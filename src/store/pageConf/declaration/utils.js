import queryString from 'query-string';
export function getImgUrl(urlData) {
  let imgArr = [];
  if (urlData && typeof urlData === 'string') {
    const url = `/djjf-web/file/downloadCretFileUrl?downloadFile=${urlData}`;
    return [{ url }];
  }
  if (!urlData || urlData === {}) {
    return imgArr;
  }
  if (!Array.isArray(urlData)) {
    urlData = [urlData];
  }
  if (urlData.length > 0) {
    imgArr = urlData.map(item => {
      const query = {
        directory: item.filePath,
        downloadFile: `${item.fileId}${item.fileNameExt}`,
        fileName: item.fileName
      };
      const url = `/djjf-web/file/download?${queryString.stringify(query)}`;
      return {
        url
      };
    });
  }
  return imgArr;
}
