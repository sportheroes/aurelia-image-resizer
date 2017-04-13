export * from './file-reader/file-reader';
export * from './image-resizer/image-resizer';
export * from './pinch/pinch';

export function configure(config) {
  config.globalResources([
    './file-reader/file-reader',
    './image-resizer/image-resizer',
    './pinch/pinch'
  ]);
}
