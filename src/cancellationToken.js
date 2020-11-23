export const validationMessage = {
  duplicatedField: (target) => {
    return `同一${target}のユーザが存在します。変更してください。`;
  },
  invalidField: (target) => {
    return `${target}が入力されていないか、不正な形式です。`;
  }
}

export const validator = {
  validUserName: (userName) => !userName,
  validEmail: (email) => {
    if (!email) return !email;

    const emailValidator = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/;
    return !emailValidator.test(email);
  },
  validPassword: (password) => !password
}