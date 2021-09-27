function ipStringToDecimal(ipString) {
  if (isIp(ipString) === false) {
    throw Error("Invalid IP address: " + ipString);
  }

  let a = ipString.split(".");

  return ((+a[0] * 256 + +a[1]) * 256 + +a[2]) * 256 + +a[3];
}

function ipDecimalToString(ipDecimal) {
  let s = ipDecimal % 256;

  for (let i = 3; i > 0; i--) {
    ipDecimal = Math.floor(ipDecimal / 256);
    s = (ipDecimal % 256) + "." + s;
  }

  return s;
}

function isIp(ip) {
  if (typeof ip !== "string") {
    return false;
  }

  let matchIpResult = ip.match(
    /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/
  );

  if (matchIpResult) {
    return true;
  } else {
    return false;
  }
}

function isValidMaskPrefix(maskPrefix) {
  if (typeof maskPrefix !== "number") {
    return false;
  } else if (maskPrefix > 0 && maskPrefix <= 32) {
    return true;
  } else {
    return false;
  }
}

function isValidMaskDotted(mask) {
  if (isIp(mask) !== true) {
    return false;
  }

  let maskResult = mask.match(
    /(((255\.){3}(255|254|252|248|240|224|192|128+))|((255\.){2}(255|254|252|248|240|224|192|128|0+)\.0)|((255\.)(255|254|252|248|240|224|192|128|0+)(\.0+){2})|((255|254|252|248|240|224|192|128|0+)(\.0+){3}))/g
  );

  if (maskResult) {
    return true;
  } else {
    return false;
  }
}

function convertMaskDottedToPrefix(mask) {
  return mask.split(".").reduce((c, o) => c - Math.log2(256 - +o), 32);
}

function convertMaskPrefixToDecimal(prefixLength) {
  let mask = 0;

  for (let i = 0; i < prefixLength; i++) {
    mask += (1 << (32 - (i + 1))) >>> 0;
  }

  return mask;
}

function convertMaskPrefixToDecimalInverse(prefixLength) {
  const inversePrefixLength = 32 - prefixLength;
  let mask = 0;

  for (let i = 0; i < inversePrefixLength; i++) {
    mask += (1 << i) >>> 0;
  }

  return mask;
}

function getClass(ip) {
  let ipDecimal = ipStringToDecimal(ip);

  if (ipDecimal < 2147483648) {
    // 0.0.0.0 to 127.255.255.255
    return "A";
  } else if (ipDecimal >= 2147483648 && ipDecimal < 3221225472) {
    // 128.0.0.0 to 191.255.255.255
    return "B";
  } else if (ipDecimal >= 3221225472 && ipDecimal < 3758096384) {
    // 192.0.0.0 to 223.255.255.255
    return "C";
  } else if (ipDecimal >= 3758096384 && ipDecimal < 4026531840) {
    // 224.0.0.0 to 239.255.255.255
    return "D";
  } else if (ipDecimal >= 4026531840 && ipDecimal <= 4294967295) {
    // 240.0.0.0 to 255.255.255.255
    return "E";
  } else {
    return "";
  }
}

function isPublic(ip) {
  let ipDecimal = ipStringToDecimal(ip);

  if (ipDecimal >= 0 && ipDecimal <= 255) {
    // 0.0.0.0/8 RFC1122
    return false;
  } else if (ipDecimal >= 167772160 && ipDecimal < 184549375) {
    // 10.0.0.0/8 RFC1918
    return false;
  } else if (ipDecimal >= 1681915904 && ipDecimal <= 1686110207) {
    // 100.64.0.0/10 RFC6598
    return false;
  } else if (ipDecimal >= 2130706432 && ipDecimal <= 2147483647) {
    // 127.0.0.0/8 RFC1122
    return false;
  } else if (ipDecimal >= 2851995648 && ipDecimal <= 2852061183) {
    // 169.254.0.0/16 RFC3927
    return false;
  } else if (ipDecimal >= 2886729728 && ipDecimal < 2886795263) {
    // 172.16.0.0/12 RFC1918
    return false;
  } else if (ipDecimal >= 3232235520 && ipDecimal < 3232301055) {
    // 192.168.0.0/16 RFC1918
    return false;
  } else if (ipDecimal >= 3221225472 && ipDecimal <= 3221225727) {
    // 192.0.0.0/24 RFC6890
    return false;
  } else if (ipDecimal >= 3221225984 && ipDecimal <= 3221226239) {
    // 192.0.2.0/24  RFC5737
    return false;
  } else if (ipDecimal >= 3323068416 && ipDecimal <= 3326083071) {
    // 198.18.0.0/15 RFC2544
    return false;
  } else if (ipDecimal >= 3325256704 && ipDecimal <= 3325256959) {
    // 198.51.100.0/24 RFC5737
    return false;
  } else if (ipDecimal >= 3405803776 && ipDecimal <= 3405804031) {
    // 203.0.113.0/24 RFC5737
    return false;
  } else if (ipDecimal >= 4026531840 && ipDecimal <= 4294967295) {
    // 240.0.0.0/4 RFC1112
    return false;
  } else {
    return true;
  }
}

export default function getSubnetInfo(ipString, mask) {
  let result = {
    error: false,
    ip: null,
    dottedMask: null,
    wildcardMask: null,
    prefixLength: null,
    networkAddress: null,
    broadcastAddress: null,
    hostRange: {
      start: null,
      end: null,
    },
    hostQuantity: null,
    isPublic: null,
    class: null,
  };

  if (isIp(ipString) && (isValidMaskDotted(mask) || isValidMaskPrefix(mask))) {
    if (isValidMaskDotted(mask)) {
      result.dottedMask = mask;
      result.prefixLength = convertMaskDottedToPrefix(mask);
    } else if (isValidMaskPrefix(mask)) {
      result.dottedMask = ipDecimalToString(convertMaskPrefixToDecimal(mask));
      result.prefixLength = mask;
    } else {
      // Unable to determine subnet details without valid subnet mask or prefix length
      result.error = true;
      return result;
    }

    result.ip = ipString;
    let ipDecimal = ipStringToDecimal(ipString);
    let maskDecimal = ipStringToDecimal(result.dottedMask);

    // Determine wildcard mask
    result.wildcardMask = ipDecimalToString(
      convertMaskPrefixToDecimalInverse(result.prefixLength)
    );

    // Determine network address
    let networkDecimal = (ipDecimal & maskDecimal) >>> 0;
    result.networkAddress = ipDecimalToString(networkDecimal);

    // Determine broadcast address
    let broadcastDecimal =
      (((ipDecimal & maskDecimal) >>> 0) +
        convertMaskPrefixToDecimalInverse(result.prefixLength)) >>>
      0;
    result.broadcastAddress = ipDecimalToString(broadcastDecimal);

    // Determine usable IP address range (network address + 1, broadcast address - 1)
    if (result.prefixLength === 31) {
      result.hostRange.start = result.networkAddress;
      result.hostRange.end = result.broadcastAddress;
      result.hostQuantity = 0;
    } else if (result.prefixLength === 32) {
      result.hostRange.start = result.networkAddress;
      result.hostRange.end = result.broadcastAddress;
      result.hostQuantity = 1;
    } else {
      result.hostRange.start = ipDecimalToString(networkDecimal + 1);
      result.hostRange.end = ipDecimalToString(broadcastDecimal - 1);
      result.hostQuantity = broadcastDecimal - networkDecimal - 1;
    }

    // Determine class
    result.class = getClass(ipString);

    // Determine if public IP
    result.isPublic = isPublic(ipString) ? "Yes" : "No";
  } else {
    result.error = true;
  }

  return result;
}
