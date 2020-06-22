enum ValidateType {
  mail,
  idcard,
  mobile,
  num
}

const textValidator = function(str: string, type: ValidateType, isRequired: boolean = false) {
  if (str === null || typeof str === 'undefined') {
    str = '';
  }
  if (!str.length && !isRequired) return true;
  let regExp: RegExp;
  switch (type) {
    case ValidateType.idcard:
      regExp = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      break;
    case ValidateType.mobile:
      // regExp = /^1[3|4|5|7|8][0-9]\d{8}$/;
      regExp = /^1[0-9]{10}$/;
      break;
    case ValidateType.mail:
      regExp = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      break;
    case ValidateType.num:
      regExp = /^[0-9]+.?[0-9]*$/;
      break;
    default:
      return false;
  }
  return regExp.test(str);
};

export { ValidateType, textValidator };
