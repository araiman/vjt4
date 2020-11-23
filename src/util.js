export class CancellationToken {

  // isCancellationRequested = false;

  constructor(parentToken = null) {
    this.cancellationPromise = new Promise(resolve => {
      this.cancel = async(e) => {
        this.isCancellationRequested = true;
        if (e) {
          resolve(e);
          return;
        } else {
          resolve("test");
          return;
          // var err = new Error("cancelled");
          // err.cancelled = true;
          // resolve(err);
        }
      }
    });
    if (parentToken && parentToken instanceof CancellationToken) {
      parentToken.register(this.cancel);
    }
  }

  register(callback) {
    this.cancellationPromise.then(callback);
  }

  createDependentToken() {
    return new CancellationToken(this);
  }

}
