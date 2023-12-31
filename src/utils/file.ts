export const convertBytes = (size: number): string => {
  if (size < 1024) {
    return `${size} bytes`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

/**
 * Check if the size is within the limit
 * @param size in bytes
 * @param limit in megabytes
 * @returns boolean
 * @example
 * checkLimit(1,048,576, 1) // true
 * checkLimit(1,048,576, 2) // false
 **/
export const checkLimit = (size: number, limit: number): string => {
  if (size === 0) {
    return 'File is empty';
  }

  const accepted = size <= limit * 1024 * 1024;

  if (!accepted) {
    return `File size exceeds the limit of ${limit} MB`;
  }

  return '';
};
