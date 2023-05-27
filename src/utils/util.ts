export function getPathName(path) {
  return path?.substring(path.lastIndexOf("/") + 1);
}
