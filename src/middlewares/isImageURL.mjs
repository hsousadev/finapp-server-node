function isImageURL(url) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.svg'];
  const lowercasedURL = url.toLowerCase();
  
  return imageExtensions.some(extension => lowercasedURL.endsWith(extension));
}

export default isImageURL;
