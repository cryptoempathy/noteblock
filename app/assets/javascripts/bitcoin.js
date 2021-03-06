var base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
if ( typeof window == "undefined" || !window ) {
  var _window = {}
} else {
  var _window = window
}
var Crypto = _window.Crypto = {};
var util = Crypto.util = {
  rotl: function( c, a ) {
    return ( c << a ) | ( c >>> ( 32 - a ) )
  },
  rotr: function( c, a ) {
    return ( c << ( 32 - a ) ) | ( c >>> a )
  },
  endian: function( b ) {
    if ( b.constructor == Number ) {
      return util.rotl( b, 8 ) & 16711935 | util.rotl( b, 24 ) & 4278255360
    }
    for ( var a = 0; a < b.length; a++ ) {
      b[ a ] = util.endian( b[ a ] )
    }
    return b
  },
  randomBytes: function( b ) {
    for ( var a = []; b > 0; b-- ) {
      a.push( Math.floor( Math.random() * 256 ) )
    }
    return a
  },
  bytesToWords: function( c ) {
    for ( var e = [], d = 0, a = 0; d < c.length; d++, a += 8 ) {
      e[ a >>> 5 ] |= c[ d ] << ( 24 - a % 32 )
    }
    return e
  },
  wordsToBytes: function( d ) {
    for ( var c = [], a = 0; a < d.length * 32; a += 8 ) {
      c.push( ( d[ a >>> 5 ] >>> ( 24 - a % 32 ) ) & 255 )
    }
    return c
  },
  bytesToHex: function( a ) {
    for ( var c = [], b = 0; b < a.length; b++ ) {
      c.push( ( a[ b ] >>> 4 ).toString( 16 ) );
      c.push( ( a[ b ] & 15 ).toString( 16 ) )
    }
    return c.join( "" )
  },
  hexToBytes: function( b ) {
    for ( var a = [], d = 0; d < b.length; d += 2 ) {
      a.push( parseInt( b.substr( d, 2 ), 16 ) )
    }
    return a
  },
  bytesToBase64: function( b ) {
    if ( typeof btoa == "function" ) {
      return btoa( Binary.bytesToString( b ) )
    }
    for ( var a = [], d = 0; d < b.length; d += 3 ) {
      var e = ( b[ d ] << 16 ) | ( b[ d + 1 ] << 8 ) | b[ d + 2 ];
      for ( var c = 0; c < 4; c++ ) {
        if ( d * 8 + c * 6 <= b.length * 8 ) {
          a.push( base64map.charAt( ( e >>> 6 * ( 3 - c ) ) & 63 ) )
        } else {
          a.push( "=" )
        }
      }
    }
    return a.join( "" )
  },
  base64ToBytes: function( b ) {
    if ( typeof atob == "function" ) {
      return Binary.stringToBytes( atob( b ) )
    }
    b = b.replace( /[^A-Z0-9+\/]/ig, "" );
    for ( var a = [], c = 0, d = 0; c < b.length; d = ++c % 4 ) {
      if ( d == 0 ) {
        continue
      }
      a.push( ( ( base64map.indexOf( b.charAt( c - 1 ) ) & ( Math.pow( 2, -2 * d + 8 ) - 1 ) ) << ( d * 2 ) ) | ( base64map.indexOf( b.charAt( c ) ) >>> ( 6 - d * 2 ) ) )
    }
    return a
  }
};
Crypto.mode = {};
var charenc = Crypto.charenc = {};
var UTF8 = charenc.UTF8 = {
  stringToBytes: function( a ) {
    return Binary.stringToBytes( unescape( encodeURIComponent( a ) ) )
  },
  bytesToString: function( a ) {
    return decodeURIComponent( escape( Binary.bytesToString( a ) ) )
  }
};
var Binary = charenc.Binary = {
  stringToBytes: function( c ) {
    for ( var a = [], b = 0; b < c.length; b++ ) {
      a.push( c.charCodeAt( b ) )
    }
    return a
  },
  bytesToString: function( a ) {
    for ( var c = [], b = 0; b < a.length; b++ ) {
      c.push( String.fromCharCode( a[ b ] ) )
    }
    return c.join( "" )
  }
};
var C = Crypto,
  util = C.util,
  charenc = C.charenc,
  UTF8 = charenc.UTF8,
  Binary = charenc.Binary;
var K = [ 1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298 ];
var SHA256 = C.SHA256 = function( c, a ) {
  var b = util.wordsToBytes( SHA256._sha256( c ) );
  return a && a.asBytes ? b : a && a.asString ? Binary.bytesToString( b ) : util.bytesToHex( b )
};
SHA256._sha256 = function( q ) {
  if ( q.constructor == String ) {
    q = UTF8.stringToBytes( q )
  }
  var z = util.bytesToWords( q ),
    A = q.length * 8,
    r = [ 1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225 ],
    s = [],
    N, M, L, J, I, G, F, E, D, B, p, o;
  z[ A >> 5 ] |= 128 << ( 24 - A % 32 );
  z[ ( ( A + 64 >> 9 ) << 4 ) + 15 ] = A;
  for ( var D = 0; D < z.length; D += 16 ) {
    N = r[ 0 ];
    M = r[ 1 ];
    L = r[ 2 ];
    J = r[ 3 ];
    I = r[ 4 ];
    G = r[ 5 ];
    F = r[ 6 ];
    E = r[ 7 ];
    for ( var B = 0; B < 64; B++ ) {
      if ( B < 16 ) {
        s[ B ] = z[ B + D ]
      } else {
        var n = s[ B - 15 ],
          v = s[ B - 2 ],
          P = ( ( n << 25 ) | ( n >>> 7 ) ) ^ ( ( n << 14 ) | ( n >>> 18 ) ) ^ ( n >>> 3 ),
          O = ( ( v << 15 ) | ( v >>> 17 ) ) ^ ( ( v << 13 ) | ( v >>> 19 ) ) ^ ( v >>> 10 );
        s[ B ] = P + ( s[ B - 7 ] >>> 0 ) + O + ( s[ B - 16 ] >>> 0 )
      }
      var u = I & G ^ ~I & F,
        k = N & M ^ N & L ^ M & L,
        y = ( ( N << 30 ) | ( N >>> 2 ) ) ^ ( ( N << 19 ) | ( N >>> 13 ) ) ^ ( ( N << 10 ) | ( N >>> 22 ) ),
        x = ( ( I << 26 ) | ( I >>> 6 ) ) ^ ( ( I << 21 ) | ( I >>> 11 ) ) ^ ( ( I << 7 ) | ( I >>> 25 ) );
      p = ( E >>> 0 ) + x + u + ( K[ B ] ) + ( s[ B ] >>> 0 );
      o = y + k;
      E = F;
      F = G;
      G = I;
      I = J + p;
      J = L;
      L = M;
      M = N;
      N = p + o
    }
    r[ 0 ] += N;
    r[ 1 ] += M;
    r[ 2 ] += L;
    r[ 3 ] += J;
    r[ 4 ] += I;
    r[ 5 ] += G;
    r[ 6 ] += F;
    r[ 7 ] += E
  }
  return r
};
SHA256._blocksize = 16;
( function() {
  var f = Crypto,
    a = f.util,
    b = f.charenc,
    e = b.UTF8,
    d = b.Binary;
  var c = f.SHA1 = function( j, g ) {
    var h = a.wordsToBytes( c._sha1( j ) );
    return g && g.asBytes ? h : g && g.asString ? d.bytesToString( h ) : a.bytesToHex( h )
  };
  c._sha1 = function( o ) {
    if ( o.constructor == String ) {
      o = e.stringToBytes( o )
    }
    var v = a.bytesToWords( o ),
      x = o.length * 8,
      p = [],
      r = 1732584193,
      q = -271733879,
      k = -1732584194,
      h = 271733878,
      g = -1009589776;
    v[ x >> 5 ] |= 128 << ( 24 - x % 32 );
    v[ ( ( x + 64 >>> 9 ) << 4 ) + 15 ] = x;
    for ( var z = 0; z < v.length; z += 16 ) {
      var F = r,
        E = q,
        D = k,
        B = h,
        A = g;
      for ( var y = 0; y < 80; y++ ) {
        if ( y < 16 ) {
          p[ y ] = v[ z + y ]
        } else {
          var u = p[ y - 3 ] ^ p[ y - 8 ] ^ p[ y - 14 ] ^ p[ y - 16 ];
          p[ y ] = ( u << 1 ) | ( u >>> 31 )
        }
        var s = ( ( r << 5 ) | ( r >>> 27 ) ) + g + ( p[ y ] >>> 0 ) + ( y < 20 ? ( q & k | ~q & h ) + 1518500249 : y < 40 ? ( q ^ k ^ h ) + 1859775393 : y < 60 ? ( q & k | q & h | k & h ) - 1894007588 : ( q ^ k ^ h ) - 899497514 );
        g = h;
        h = k;
        k = ( q << 30 ) | ( q >>> 2 );
        q = r;
        r = s
      }
      r += F;
      q += E;
      k += D;
      h += B;
      g += A
    }
    return [ r, q, k, h, g ]
  };
  c._blocksize = 16;
  c._digestsize = 20
} )();
var C = Crypto,
  util = C.util,
  charenc = C.charenc,
  UTF8 = charenc.UTF8,
  Binary = charenc.Binary;
util.bytesToLWords = function( a ) {
  var b = Array( a.length >> 2 );
  for ( var c = 0; c < b.length; c++ ) {
    b[ c ] = 0
  }
  for ( var c = 0; c < a.length * 8; c += 8 ) {
    b[ c >> 5 ] |= ( a[ c / 8 ] & 255 ) << ( c % 32 )
  }
  return b
};
util.lWordsToBytes = function( c ) {
  var a = [];
  for ( var b = 0; b < c.length * 32; b += 8 ) {
    a.push( ( c[ b >> 5 ] >>> ( b % 32 ) ) & 255 )
  }
  return a
};
var RIPEMD160 = C.RIPEMD160 = function( c, a ) {
  var b = util.lWordsToBytes( RIPEMD160._rmd160( c ) );
  return a && a.asBytes ? b : a && a.asString ? Binary.bytesToString( b ) : util.bytesToHex( b )
};
RIPEMD160._rmd160 = function( r ) {
  if ( r.constructor == String ) {
    r = UTF8.stringToBytes( r )
  }
  var q = util.bytesToLWords( r ),
    y = r.length * 8;
  q[ y >> 5 ] |= 128 << ( y % 32 );
  q[ ( ( ( y + 64 ) >>> 9 ) << 4 ) + 14 ] = y;
  var l = 1732584193;
  var k = 4023233417;
  var h = 2562383102;
  var g = 271733878;
  var f = 3285377520;
  for ( var w = 0; w < q.length; w += 16 ) {
    var e;
    var c = l,
      o = k,
      v = h,
      d = g,
      p = f;
    var a = l,
      m = k,
      u = h,
      b = g,
      n = f;
    for ( var s = 0; s <= 79; ++s ) {
      e = safe_add( c, rmd160_f( s, o, v, d ) );
      e = safe_add( e, q[ w + rmd160_r1[ s ] ] );
      e = safe_add( e, rmd160_K1( s ) );
      e = safe_add( bit_rol( e, rmd160_s1[ s ] ), p );
      c = p;
      p = d;
      d = bit_rol( v, 10 );
      v = o;
      o = e;
      e = safe_add( a, rmd160_f( 79 - s, m, u, b ) );
      e = safe_add( e, q[ w + rmd160_r2[ s ] ] );
      e = safe_add( e, rmd160_K2( s ) );
      e = safe_add( bit_rol( e, rmd160_s2[ s ] ), n );
      a = n;
      n = b;
      b = bit_rol( u, 10 );
      u = m;
      m = e
    }
    e = safe_add( k, safe_add( v, b ) );
    k = safe_add( h, safe_add( d, n ) );
    h = safe_add( g, safe_add( p, a ) );
    g = safe_add( f, safe_add( c, m ) );
    f = safe_add( l, safe_add( o, u ) );
    l = e
  }
  return [ l, k, h, g, f ]
};

function rmd160_f( b, a, d, c ) {
  return ( 0 <= b && b <= 15 ) ? ( a ^ d ^ c ) : ( 16 <= b && b <= 31 ) ? ( a & d ) | ( ~a & c ) : ( 32 <= b && b <= 47 ) ? ( a | ~d ) ^ c : ( 48 <= b && b <= 63 ) ? ( a & c ) | ( d & ~c ) : ( 64 <= b && b <= 79 ) ? a ^ ( d | ~c ) : "rmd160_f: j out of range"
}

function rmd160_K1( a ) {
  return ( 0 <= a && a <= 15 ) ? 0 : ( 16 <= a && a <= 31 ) ? 1518500249 : ( 32 <= a && a <= 47 ) ? 1859775393 : ( 48 <= a && a <= 63 ) ? 2400959708 : ( 64 <= a && a <= 79 ) ? 2840853838 : "rmd160_K1: j out of range"
}

function rmd160_K2( a ) {
  return ( 0 <= a && a <= 15 ) ? 1352829926 : ( 16 <= a && a <= 31 ) ? 1548603684 : ( 32 <= a && a <= 47 ) ? 1836072691 : ( 48 <= a && a <= 63 ) ? 2053994217 : ( 64 <= a && a <= 79 ) ? 0 : "rmd160_K2: j out of range"
}
var rmd160_r1 = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13 ];
var rmd160_r2 = [ 5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11 ];
var rmd160_s1 = [ 11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6 ];
var rmd160_s2 = [ 8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11 ];

function safe_add( a, d ) {
  var c = ( a & 65535 ) + ( d & 65535 );
  var b = ( a >> 16 ) + ( d >> 16 ) + ( c >> 16 );
  return ( b << 16 ) | ( c & 65535 )
}

function bit_rol( a, b ) {
  return ( a << b ) | ( a >>> ( 32 - b ) )
}
/*!
 * Crypto-JS contribution from Simon Greatrix
 */
( function( a ) {
  var l = a.pad = {};

  function c( r, u ) {
    var v = r._blocksize * 4;
    var s = v - u.length % v;
    return s
  }
  var d = function( s, v, z, x ) {
    var w = v.pop();
    if ( w == 0 ) {
      throw new Error( "Invalid zero-length padding specified for " + z + ". Wrong cipher specification or key used?" )
    }
    var y = s._blocksize * 4;
    if ( w > y ) {
      throw new Error( "Invalid padding length of " + w + " specified for " + z + ". Wrong cipher specification or key used?" )
    }
    for ( var u = 1; u < w; u++ ) {
      var r = v.pop();
      if ( x != undefined && x != r ) {
        throw new Error( "Invalid padding byte of 0x" + r.toString( 16 ) + " specified for " + z + ". Wrong cipher specification or key used?" )
      }
    }
  };
  l.NoPadding = {
    pad: function( r, s ) {},
    unpad: function( r, s ) {}
  };
  l.ZeroPadding = {
    pad: function( r, u ) {
      var v = r._blocksize * 4;
      var s = u.length % v;
      if ( s != 0 ) {
        for ( s = v - s; s > 0; s-- ) {
          u.push( 0 )
        }
      }
    },
    unpad: function( r, s ) {
      while ( s[ s.length - 1 ] == 0 ) {
        s.pop()
      }
    }
  };
  l.iso7816 = {
    pad: function( r, u ) {
      var s = c( r, u );
      u.push( 128 );
      for ( ; s > 1; s-- ) {
        u.push( 0 )
      }
    },
    unpad: function( s, u ) {
      var v;
      for ( v = s._blocksize * 4; v > 0; v-- ) {
        var r = u.pop();
        if ( r == 128 ) {
          return
        }
        if ( r != 0 ) {
          throw new Error( "ISO-7816 padding byte must be 0, not 0x" + r.toString( 16 ) + ". Wrong cipher specification or key used?" )
        }
      }
      throw new Error( "ISO-7816 padded beyond cipher block size. Wrong cipher specification or key used?" )
    }
  };
  l.ansix923 = {
    pad: function( r, v ) {
      var u = c( r, v );
      for ( var s = 1; s < u; s++ ) {
        v.push( 0 )
      }
      v.push( u )
    },
    unpad: function( r, s ) {
      d( r, s, "ANSI X.923", 0 )
    }
  };
  l.iso10126 = {
    pad: function( r, v ) {
      var u = c( r, v );
      for ( var s = 1; s < u; s++ ) {
        v.push( Math.floor( Math.random() * 256 ) )
      }
      v.push( u )
    },
    unpad: function( r, s ) {
      d( r, s, "ISO 10126", undefined )
    }
  };
  l.pkcs7 = {
    pad: function( r, v ) {
      var u = c( r, v );
      for ( var s = 0; s < u; s++ ) {
        v.push( u )
      }
    },
    unpad: function( r, s ) {
      d( r, s, "PKCS 7", s[ s.length - 1 ] )
    }
  };
  var k = a.mode = {};
  var p = k.Mode = function( r ) {
    if ( r ) {
      this._padding = r
    }
  };
  p.prototype = {
    encrypt: function( s, r, u ) {
      this._padding.pad( s, r );
      this._doEncrypt( s, r, u )
    },
    decrypt: function( s, r, u ) {
      this._doDecrypt( s, r, u );
      this._padding.unpad( s, r )
    },
    _padding: l.iso7816
  };
  var o = k.ECB = function() {
    p.apply( this, arguments )
  };
  var h = o.prototype = new p;
  h._doEncrypt = function( s, r, u ) {
    var w = s._blocksize * 4;
    for ( var v = 0; v < r.length; v += w ) {
      s._encryptblock( r, v )
    }
  };
  h._doDecrypt = function( r, w, s ) {
    var v = r._blocksize * 4;
    for ( var u = 0; u < w.length; u += v ) {
      r._decryptblock( w, u )
    }
  };
  h.fixOptions = function( r ) {
    r.iv = []
  };
  var m = k.CBC = function() {
    p.apply( this, arguments )
  };
  var f = m.prototype = new p;
  f._doEncrypt = function( s, r, u ) {
    var x = s._blocksize * 4;
    for ( var w = 0; w < r.length; w += x ) {
      if ( w == 0 ) {
        for ( var v = 0; v < x; v++ ) {
          r[ v ] ^= u[ v ]
        }
      } else {
        for ( var v = 0; v < x; v++ ) {
          r[ w + v ] ^= r[ w + v - x ]
        }
      }
      s._encryptblock( r, w )
    }
  };
  f._doDecrypt = function( r, z, u ) {
    var y = r._blocksize * 4;
    var w = u;
    for ( var x = 0; x < z.length; x += y ) {
      var s = z.slice( x, x + y );
      r._decryptblock( z, x );
      for ( var v = 0; v < y; v++ ) {
        z[ x + v ] ^= w[ v ]
      }
      w = s
    }
  };
  var e = k.CFB = function() {
    p.apply( this, arguments )
  };
  var b = e.prototype = new p;
  b._padding = l.NoPadding;
  b._doEncrypt = function( s, r, v ) {
    var y = s._blocksize * 4,
      x = v.slice( 0 );
    for ( var w = 0; w < r.length; w++ ) {
      var u = w % y;
      if ( u == 0 ) {
        s._encryptblock( x, 0 )
      }
      r[ w ] ^= x[ u ];
      x[ u ] = r[ w ]
    }
  };
  b._doDecrypt = function( s, z, v ) {
    var y = s._blocksize * 4,
      x = v.slice( 0 );
    for ( var w = 0; w < z.length; w++ ) {
      var u = w % y;
      if ( u == 0 ) {
        s._encryptblock( x, 0 )
      }
      var r = z[ w ];
      z[ w ] ^= x[ u ];
      x[ u ] = r
    }
  };
  var q = k.OFB = function() {
    p.apply( this, arguments )
  };
  var j = q.prototype = new p;
  j._padding = l.NoPadding;
  j._doEncrypt = function( s, r, u ) {
    var x = s._blocksize * 4,
      w = u.slice( 0 );
    for ( var v = 0; v < r.length; v++ ) {
      if ( v % x == 0 ) {
        s._encryptblock( w, 0 )
      }
      r[ v ] ^= w[ v % x ]
    }
  };
  j._doDecrypt = j._doEncrypt;
  var n = k.CTR = function() {
    p.apply( this, arguments )
  };
  var g = n.prototype = new p;
  g._padding = l.NoPadding;
  g._doEncrypt = function( s, r, w ) {
    var z = s._blocksize * 4;
    var u = w.slice( 0 );
    for ( var x = 0; x < r.length; ) {
      var y = u.slice( 0 );
      s._encryptblock( y, 0 );
      for ( var v = 0; x < r.length && v < z; v++, x++ ) {
        r[ x ] ^= y[ v ]
      }
      if ( ++( u[ z - 1 ] ) == 256 ) {
        u[ z - 1 ] = 0;
        if ( ++( u[ z - 2 ] ) == 256 ) {
          u[ z - 2 ] = 0;
          if ( ++( u[ z - 3 ] ) == 256 ) {
            u[ z - 3 ] = 0;
            ++( u[ z - 4 ] )
          }
        }
      }
    }
  };
  g._doDecrypt = g._doEncrypt
} )( Crypto );
( function() {
  var e = Crypto,
    a = e.util,
    b = e.charenc,
    d = b.UTF8,
    c = b.Binary;
  e.HMAC = function( l, m, k, h ) {
    if ( m.constructor == String ) {
      m = d.stringToBytes( m )
    }
    if ( k.constructor == String ) {
      k = d.stringToBytes( k )
    }
    if ( k.length > l._blocksize * 4 ) {
      k = l( k, {
        asBytes: true
      } )
    }
    var g = k.slice( 0 ),
      n = k.slice( 0 );
    for ( var j = 0; j < l._blocksize * 4; j++ ) {
      g[ j ] ^= 92;
      n[ j ] ^= 54
    }
    var f = l( g.concat( l( n.concat( m ), {
      asBytes: true
    } ) ), {
      asBytes: true
    } );
    return h && h.asBytes ? f : h && h.asString ? c.bytesToString( f ) : a.bytesToHex( f )
  }
} )();
( function() {
  var e = Crypto,
    a = e.util,
    b = e.charenc,
    d = b.UTF8,
    c = b.Binary;
  e.PBKDF2 = function( q, o, f, v ) {
    if ( q.constructor == String ) {
      q = d.stringToBytes( q )
    }
    if ( o.constructor == String ) {
      o = d.stringToBytes( o )
    }
    var s = v && v.hasher || e.SHA1,
      k = v && v.iterations || 1;

    function p( j, u ) {
      return e.HMAC( s, u, j, {
        asBytes: true
      } )
    }
    var h = [],
      g = 1;
    while ( h.length < f ) {
      var l = p( q, o.concat( a.wordsToBytes( [ g ] ) ) );
      for ( var r = l, n = 1; n < k; n++ ) {
        r = p( q, r );
        for ( var m = 0; m < l.length; m++ ) {
          l[ m ] ^= r[ m ]
        }
      }
      h = h.concat( l );
      g++
    }
    h.length = f;
    return v && v.asBytes ? h : v && v.asString ? c.bytesToString( h ) : a.bytesToHex( h )
  }
} )();
( function() {
  var k = Crypto,
    a = k.util,
    u = k.charenc,
    r = u.UTF8;
  var v = [ 99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22 ];
  for ( var m = [], q = 0; q < 256; q++ ) {
    m[ v[ q ] ] = q
  }
  var p = [],
    o = [],
    l = [],
    h = [],
    g = [],
    e = [];

  function f( y, x ) {
    for ( var w = 0, z = 0; z < 8; z++ ) {
      if ( x & 1 ) {
        w ^= y
      }
      var A = y & 128;
      y = ( y << 1 ) & 255;
      if ( A ) {
        y ^= 27
      }
      x >>>= 1
    }
    return w
  }
  for ( var q = 0; q < 256; q++ ) {
    p[ q ] = f( q, 2 );
    o[ q ] = f( q, 3 );
    l[ q ] = f( q, 9 );
    h[ q ] = f( q, 11 );
    g[ q ] = f( q, 13 );
    e[ q ] = f( q, 14 )
  }
  var j = [ 0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54 ];
  var c = [
    [],
    [],
    [],
    []
  ],
    d, b, s;
  var n = k.AES = {
    encrypt: function( B, A, z ) {
      z = z || {};
      var D = z.mode || new k.mode.OFB;
      if ( D.fixOptions ) {
        D.fixOptions( z )
      }
      var w = ( B.constructor == String ? r.stringToBytes( B ) : B ),
        y = z.iv || a.randomBytes( n._blocksize * 4 ),
        x = ( A.constructor == String ? k.PBKDF2( A, y, 32, {
          asBytes: true,
          iterations: z.iterations
        } ) : A );
      n._init( x );
      D.encrypt( n, w, y );
      w = z.iv ? w : y.concat( w );
      return ( z && z.asBytes ) ? w : a.bytesToBase64( w )
    },
    decrypt: function( A, z, y ) {
      y = y || {};
      var B = y.mode || new k.mode.OFB;
      if ( B.fixOptions ) {
        B.fixOptions( y )
      }
      var D = ( A.constructor == String ? a.base64ToBytes( A ) : A ),
        x = y.iv || D.splice( 0, n._blocksize * 4 ),
        w = ( z.constructor == String ? k.PBKDF2( z, x, 32, {
          asBytes: true,
          iterations: y.iterations
        } ) : z );
      n._init( w );
      B.decrypt( n, D, x );
      return ( y && y.asBytes ) ? D : r.bytesToString( D )
    },
    _blocksize: 4,
    _encryptblock: function( x, y ) {
      for ( var F = 0; F < n._blocksize; F++ ) {
        for ( var w = 0; w < 4; w++ ) {
          c[ F ][ w ] = x[ y + w * 4 + F ]
        }
      }
      for ( var F = 0; F < 4; F++ ) {
        for ( var w = 0; w < 4; w++ ) {
          c[ F ][ w ] ^= s[ w ][ F ]
        }
      }
      for ( var E = 1; E < b; E++ ) {
        for ( var F = 0; F < 4; F++ ) {
          for ( var w = 0; w < 4; w++ ) {
            c[ F ][ w ] = v[ c[ F ][ w ] ]
          }
        }
        c[ 1 ].push( c[ 1 ].shift() );
        c[ 2 ].push( c[ 2 ].shift() );
        c[ 2 ].push( c[ 2 ].shift() );
        c[ 3 ].unshift( c[ 3 ].pop() );
        for ( var w = 0; w < 4; w++ ) {
          var D = c[ 0 ][ w ],
            B = c[ 1 ][ w ],
            A = c[ 2 ][ w ],
            z = c[ 3 ][ w ];
          c[ 0 ][ w ] = p[ D ] ^ o[ B ] ^ A ^ z;
          c[ 1 ][ w ] = D ^ p[ B ] ^ o[ A ] ^ z;
          c[ 2 ][ w ] = D ^ B ^ p[ A ] ^ o[ z ];
          c[ 3 ][ w ] = o[ D ] ^ B ^ A ^ p[ z ]
        }
        for ( var F = 0; F < 4; F++ ) {
          for ( var w = 0; w < 4; w++ ) {
            c[ F ][ w ] ^= s[ E * 4 + w ][ F ]
          }
        }
      }
      for ( var F = 0; F < 4; F++ ) {
        for ( var w = 0; w < 4; w++ ) {
          c[ F ][ w ] = v[ c[ F ][ w ] ]
        }
      }
      c[ 1 ].push( c[ 1 ].shift() );
      c[ 2 ].push( c[ 2 ].shift() );
      c[ 2 ].push( c[ 2 ].shift() );
      c[ 3 ].unshift( c[ 3 ].pop() );
      for ( var F = 0; F < 4; F++ ) {
        for ( var w = 0; w < 4; w++ ) {
          c[ F ][ w ] ^= s[ b * 4 + w ][ F ]
        }
      }
      for ( var F = 0; F < n._blocksize; F++ ) {
        for ( var w = 0; w < 4; w++ ) {
          x[ y + w * 4 + F ] = c[ F ][ w ]
        }
      }
    },
    _decryptblock: function( y, x ) {
      for ( var F = 0; F < n._blocksize; F++ ) {
        for ( var w = 0; w < 4; w++ ) {
          c[ F ][ w ] = y[ x + w * 4 + F ]
        }
      }
      for ( var F = 0; F < 4; F++ ) {
        for ( var w = 0; w < 4; w++ ) {
          c[ F ][ w ] ^= s[ b * 4 + w ][ F ]
        }
      }
      for ( var E = 1; E < b; E++ ) {
        c[ 1 ].unshift( c[ 1 ].pop() );
        c[ 2 ].push( c[ 2 ].shift() );
        c[ 2 ].push( c[ 2 ].shift() );
        c[ 3 ].push( c[ 3 ].shift() );
        for ( var F = 0; F < 4; F++ ) {
          for ( var w = 0; w < 4; w++ ) {
            c[ F ][ w ] = m[ c[ F ][ w ] ]
          }
        }
        for ( var F = 0; F < 4; F++ ) {
          for ( var w = 0; w < 4; w++ ) {
            c[ F ][ w ] ^= s[ ( b - E ) * 4 + w ][ F ]
          }
        }
        for ( var w = 0; w < 4; w++ ) {
          var D = c[ 0 ][ w ],
            B = c[ 1 ][ w ],
            A = c[ 2 ][ w ],
            z = c[ 3 ][ w ];
          c[ 0 ][ w ] = e[ D ] ^ h[ B ] ^ g[ A ] ^ l[ z ];
          c[ 1 ][ w ] = l[ D ] ^ e[ B ] ^ h[ A ] ^ g[ z ];
          c[ 2 ][ w ] = g[ D ] ^ l[ B ] ^ e[ A ] ^ h[ z ];
          c[ 3 ][ w ] = h[ D ] ^ g[ B ] ^ l[ A ] ^ e[ z ]
        }
      }
      c[ 1 ].unshift( c[ 1 ].pop() );
      c[ 2 ].push( c[ 2 ].shift() );
      c[ 2 ].push( c[ 2 ].shift() );
      c[ 3 ].push( c[ 3 ].shift() );
      for ( var F = 0; F < 4; F++ ) {
        for ( var w = 0; w < 4; w++ ) {
          c[ F ][ w ] = m[ c[ F ][ w ] ]
        }
      }
      for ( var F = 0; F < 4; F++ ) {
        for ( var w = 0; w < 4; w++ ) {
          c[ F ][ w ] ^= s[ w ][ F ]
        }
      }
      for ( var F = 0; F < n._blocksize; F++ ) {
        for ( var w = 0; w < 4; w++ ) {
          y[ x + w * 4 + F ] = c[ F ][ w ]
        }
      }
    },
    _init: function( w ) {
      d = w.length / 4;
      b = d + 6;
      n._keyexpansion( w )
    },
    _keyexpansion: function( x ) {
      s = [];
      for ( var y = 0; y < d; y++ ) {
        s[ y ] = [ x[ y * 4 ], x[ y * 4 + 1 ], x[ y * 4 + 2 ], x[ y * 4 + 3 ] ]
      }
      for ( var y = d; y < n._blocksize * ( b + 1 ); y++ ) {
        var w = [ s[ y - 1 ][ 0 ], s[ y - 1 ][ 1 ], s[ y - 1 ][ 2 ], s[ y - 1 ][ 3 ] ];
        if ( y % d == 0 ) {
          w.push( w.shift() );
          w[ 0 ] = v[ w[ 0 ] ];
          w[ 1 ] = v[ w[ 1 ] ];
          w[ 2 ] = v[ w[ 2 ] ];
          w[ 3 ] = v[ w[ 3 ] ];
          w[ 0 ] ^= j[ y / d ]
        } else {
          if ( d > 6 && y % d == 4 ) {
            w[ 0 ] = v[ w[ 0 ] ];
            w[ 1 ] = v[ w[ 1 ] ];
            w[ 2 ] = v[ w[ 2 ] ];
            w[ 3 ] = v[ w[ 3 ] ]
          }
        }
        s[ y ] = [ s[ y - d ][ 0 ] ^ w[ 0 ], s[ y - d ][ 1 ] ^ w[ 1 ], s[ y - d ][ 2 ] ^ w[ 2 ], s[ y - d ][ 3 ] ^ w[ 3 ] ]
      }
    }
  }
} )();

function ECFieldElementFp( b, a ) {
  this.x = a;
  this.q = b
}

function feFpEquals( a ) {
  if ( a == this ) {
    return true
  }
  return ( this.q.equals( a.q ) && this.x.equals( a.x ) )
}

function feFpToBigInteger() {
  return this.x
}

function feFpNegate() {
  return new ECFieldElementFp( this.q, this.x.negate().mod( this.q ) )
}

function feFpAdd( a ) {
  return new ECFieldElementFp( this.q, this.x.add( a.toBigInteger() ).mod( this.q ) )
}

function feFpSubtract( a ) {
  return new ECFieldElementFp( this.q, this.x.subtract( a.toBigInteger() ).mod( this.q ) )
}

function feFpMultiply( a ) {
  return new ECFieldElementFp( this.q, this.x.multiply( a.toBigInteger() ).mod( this.q ) )
}

function feFpSquare() {
  return new ECFieldElementFp( this.q, this.x.square().mod( this.q ) )
}

function feFpDivide( a ) {
  return new ECFieldElementFp( this.q, this.x.multiply( a.toBigInteger().modInverse( this.q ) ).mod( this.q ) )
}
ECFieldElementFp.prototype.equals = feFpEquals;
ECFieldElementFp.prototype.toBigInteger = feFpToBigInteger;
ECFieldElementFp.prototype.negate = feFpNegate;
ECFieldElementFp.prototype.add = feFpAdd;
ECFieldElementFp.prototype.subtract = feFpSubtract;
ECFieldElementFp.prototype.multiply = feFpMultiply;
ECFieldElementFp.prototype.square = feFpSquare;
ECFieldElementFp.prototype.divide = feFpDivide;

function ECPointFp( c, a, d, b ) {
  this.curve = c;
  this.x = a;
  this.y = d;
  if ( b == null ) {
    this.z = BigInteger.ONE
  } else {
    this.z = b
  }
  this.zinv = null
}

function pointFpGetX() {
  if ( this.zinv == null ) {
    this.zinv = this.z.modInverse( this.curve.q )
  }
  return this.curve.fromBigInteger( this.x.toBigInteger().multiply( this.zinv ).mod( this.curve.q ) )
}

function pointFpGetY() {
  if ( this.zinv == null ) {
    this.zinv = this.z.modInverse( this.curve.q )
  }
  return this.curve.fromBigInteger( this.y.toBigInteger().multiply( this.zinv ).mod( this.curve.q ) )
}

function pointFpEquals( a ) {
  if ( a == this ) {
    return true
  }
  if ( this.isInfinity() ) {
    return a.isInfinity()
  }
  if ( a.isInfinity() ) {
    return this.isInfinity()
  }
  var c, b;
  c = a.y.toBigInteger().multiply( this.z ).subtract( this.y.toBigInteger().multiply( a.z ) ).mod( this.curve.q );
  if ( !c.equals( BigInteger.ZERO ) ) {
    return false
  }
  b = a.x.toBigInteger().multiply( this.z ).subtract( this.x.toBigInteger().multiply( a.z ) ).mod( this.curve.q );
  return b.equals( BigInteger.ZERO )
}

function pointFpIsInfinity() {
  if ( ( this.x == null ) && ( this.y == null ) ) {
    return true
  }
  return this.z.equals( BigInteger.ZERO ) && !this.y.toBigInteger().equals( BigInteger.ZERO )
}

function pointFpNegate() {
  return new ECPointFp( this.curve, this.x, this.y.negate(), this.z )
}

function pointFpAdd( m ) {
  if ( this.isInfinity() ) {
    return m
  }
  if ( m.isInfinity() ) {
    return this
  }
  var q = m.y.toBigInteger().multiply( this.z ).subtract( this.y.toBigInteger().multiply( m.z ) ).mod( this.curve.q );
  var p = m.x.toBigInteger().multiply( this.z ).subtract( this.x.toBigInteger().multiply( m.z ) ).mod( this.curve.q );
  if ( BigInteger.ZERO.equals( p ) ) {
    if ( BigInteger.ZERO.equals( q ) ) {
      return this.twice()
    }
    return this.curve.getInfinity()
  }
  var k = new BigInteger( "3" );
  var e = this.x.toBigInteger();
  var o = this.y.toBigInteger();
  var c = m.x.toBigInteger();
  var l = m.y.toBigInteger();
  var n = p.square();
  var j = n.multiply( p );
  var d = e.multiply( n );
  var g = q.square().multiply( this.z );
  var a = g.subtract( d.shiftLeft( 1 ) ).multiply( m.z ).subtract( j ).multiply( p ).mod( this.curve.q );
  var h = d.multiply( k ).multiply( q ).subtract( o.multiply( j ) ).subtract( g.multiply( q ) ).multiply( m.z ).add( q.multiply( j ) ).mod( this.curve.q );
  var f = j.multiply( this.z ).multiply( m.z ).mod( this.curve.q );
  return new ECPointFp( this.curve, this.curve.fromBigInteger( a ), this.curve.fromBigInteger( h ), f )
}

function pointFpTwice() {
  if ( this.isInfinity() ) {
    return this
  }
  if ( this.y.toBigInteger().signum() == 0 ) {
    return this.curve.getInfinity()
  }
  var g = new BigInteger( "3" );
  var c = this.x.toBigInteger();
  var h = this.y.toBigInteger();
  var e = h.multiply( this.z );
  var k = e.multiply( h ).mod( this.curve.q );
  var j = this.curve.a.toBigInteger();
  var l = c.square().multiply( g );
  if ( !BigInteger.ZERO.equals( j ) ) {
    l = l.add( this.z.square().multiply( j ) )
  }
  l = l.mod( this.curve.q );
  var b = l.square().subtract( c.shiftLeft( 3 ).multiply( k ) ).shiftLeft( 1 ).multiply( e ).mod( this.curve.q );
  var f = l.multiply( g ).multiply( c ).subtract( k.shiftLeft( 1 ) ).shiftLeft( 2 ).multiply( k ).subtract( l.square().multiply( l ) ).mod( this.curve.q );
  var d = e.square().multiply( e ).shiftLeft( 3 ).mod( this.curve.q );
  return new ECPointFp( this.curve, this.curve.fromBigInteger( b ), this.curve.fromBigInteger( f ), d )
}

function pointFpMultiply( b ) {
  if ( this.isInfinity() ) {
    return this
  }
  if ( b.signum() == 0 ) {
    return this.curve.getInfinity()
  }
  var g = b;
  var f = g.multiply( new BigInteger( "3" ) );
  var l = this.negate();
  var d = this;
  var c;
  for ( c = f.bitLength() - 2; c > 0; --c ) {
    d = d.twice();
    var a = f.testBit( c );
    var j = g.testBit( c );
    if ( a != j ) {
      d = d.add( a ? this : l )
    }
  }
  return d
}

function pointFpMultiplyTwo( c, a, b ) {
  var d;
  if ( c.bitLength() > b.bitLength() ) {
    d = c.bitLength() - 1
  } else {
    d = b.bitLength() - 1
  }
  var f = this.curve.getInfinity();
  var e = this.add( a );
  while ( d >= 0 ) {
    f = f.twice();
    if ( c.testBit( d ) ) {
      if ( b.testBit( d ) ) {
        f = f.add( e )
      } else {
        f = f.add( this )
      }
    } else {
      if ( b.testBit( d ) ) {
        f = f.add( a )
      }
    }--d
  }
  return f
}
ECPointFp.prototype.getX = pointFpGetX;
ECPointFp.prototype.getY = pointFpGetY;
ECPointFp.prototype.equals = pointFpEquals;
ECPointFp.prototype.isInfinity = pointFpIsInfinity;
ECPointFp.prototype.negate = pointFpNegate;
ECPointFp.prototype.add = pointFpAdd;
ECPointFp.prototype.twice = pointFpTwice;
ECPointFp.prototype.multiply = pointFpMultiply;
ECPointFp.prototype.multiplyTwo = pointFpMultiplyTwo;

function ECCurveFp( e, d, c ) {
  this.q = e;
  this.a = this.fromBigInteger( d );
  this.b = this.fromBigInteger( c );
  this.infinity = new ECPointFp( this, null, null )
}

function curveFpGetQ() {
  return this.q
}

function curveFpGetA() {
  return this.a
}

function curveFpGetB() {
  return this.b
}

function curveFpEquals( a ) {
  if ( a == this ) {
    return true
  }
  return ( this.q.equals( a.q ) && this.a.equals( a.a ) && this.b.equals( a.b ) )
}

function curveFpGetInfinity() {
  return this.infinity
}

function curveFpFromBigInteger( a ) {
  return new ECFieldElementFp( this.q, a )
}

function curveFpDecodePointHex( d ) {
  switch ( parseInt( d.substr( 0, 2 ), 16 ) ) {
    case 0:
      return this.infinity;
    case 2:
    case 3:
      return null;
    case 4:
    case 6:
    case 7:
      var a = ( d.length - 2 ) / 2;
      var c = d.substr( 2, a );
      var b = d.substr( a + 2, a );
      return new ECPointFp( this, this.fromBigInteger( new BigInteger( c, 16 ) ), this.fromBigInteger( new BigInteger( b, 16 ) ) );
    default:
      return null
  }
}
ECCurveFp.prototype.getQ = curveFpGetQ;
ECCurveFp.prototype.getA = curveFpGetA;
ECCurveFp.prototype.getB = curveFpGetB;
ECCurveFp.prototype.equals = curveFpEquals;
ECCurveFp.prototype.getInfinity = curveFpGetInfinity;
ECCurveFp.prototype.fromBigInteger = curveFpFromBigInteger;
ECCurveFp.prototype.decodePointHex = curveFpDecodePointHex;
var dbits;
var canary = 244837814094590;
var j_lm = ( ( canary & 16777215 ) == 15715070 );

function BigInteger( e, d, f ) {
  if ( e != null ) {
    if ( "number" == typeof e ) {
      this.fromNumber( e, d, f )
    } else {
      if ( d == null && "string" != typeof e ) {
        this.fromString( e, 256 )
      } else {
        this.fromString( e, d )
      }
    }
  }
}

function nbi() {
  return new BigInteger( null )
}

function am1( f, a, b, e, h, g ) {
  while ( --g >= 0 ) {
    var d = a * this[ f++ ] + b[ e ] + h;
    h = Math.floor( d / 67108864 );
    b[ e++ ] = d & 67108863
  }
  return h
}

function am2( f, q, r, e, o, a ) {
  var k = q & 32767,
    p = q >> 15;
  while ( --a >= 0 ) {
    var d = this[ f ] & 32767;
    var g = this[ f++ ] >> 15;
    var b = p * d + g * k;
    d = k * d + ( ( b & 32767 ) << 15 ) + r[ e ] + ( o & 1073741823 );
    o = ( d >>> 30 ) + ( b >>> 15 ) + p * g + ( o >>> 30 );
    r[ e++ ] = d & 1073741823
  }
  return o
}

function am3( f, q, r, e, o, a ) {
  var k = q & 16383,
    p = q >> 14;
  while ( --a >= 0 ) {
    var d = this[ f ] & 16383;
    var g = this[ f++ ] >> 14;
    var b = p * d + g * k;
    d = k * d + ( ( b & 16383 ) << 14 ) + r[ e ] + o;
    o = ( d >> 28 ) + ( b >> 14 ) + p * g;
    r[ e++ ] = d & 268435455
  }
  return o
}
if ( j_lm && ( navigator.appName == "Microsoft Internet Explorer" ) ) {
  BigInteger.prototype.am = am2;
  dbits = 30
} else {
  if ( j_lm && ( navigator.appName != "Netscape" ) ) {
    BigInteger.prototype.am = am1;
    dbits = 26
  } else {
    BigInteger.prototype.am = am3;
    dbits = 28
  }
}
BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ( ( 1 << dbits ) - 1 );
BigInteger.prototype.DV = ( 1 << dbits );
var BI_FP = 52;
BigInteger.prototype.FV = Math.pow( 2, BI_FP );
BigInteger.prototype.F1 = BI_FP - dbits;
BigInteger.prototype.F2 = 2 * dbits - BI_FP;
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr, vv;
rr = "0".charCodeAt( 0 );
for ( vv = 0; vv <= 9; ++vv ) {
  BI_RC[ rr++ ] = vv
}
rr = "a".charCodeAt( 0 );
for ( vv = 10; vv < 36; ++vv ) {
  BI_RC[ rr++ ] = vv
}
rr = "A".charCodeAt( 0 );
for ( vv = 10; vv < 36; ++vv ) {
  BI_RC[ rr++ ] = vv
}

function int2char( a ) {
  return BI_RM.charAt( a )
}

function intAt( b, a ) {
  var d = BI_RC[ b.charCodeAt( a ) ];
  return ( d == null ) ? -1 : d
}

function bnpCopyTo( b ) {
  for ( var a = this.t - 1; a >= 0; --a ) {
    b[ a ] = this[ a ]
  }
  b.t = this.t;
  b.s = this.s
}

function bnpFromInt( a ) {
  this.t = 1;
  this.s = ( a < 0 ) ? -1 : 0;
  if ( a > 0 ) {
    this[ 0 ] = a
  } else {
    if ( a < -1 ) {
      this[ 0 ] = a + DV
    } else {
      this.t = 0
    }
  }
}

function nbv( a ) {
  var b = nbi();
  b.fromInt( a );
  return b
}

function bnpFromString( h, c ) {
  var e;
  if ( c == 16 ) {
    e = 4
  } else {
    if ( c == 8 ) {
      e = 3
    } else {
      if ( c == 256 ) {
        e = 8
      } else {
        if ( c == 2 ) {
          e = 1
        } else {
          if ( c == 32 ) {
            e = 5
          } else {
            if ( c == 4 ) {
              e = 2
            } else {
              this.fromRadix( h, c );
              return
            }
          }
        }
      }
    }
  }
  this.t = 0;
  this.s = 0;
  var g = h.length,
    d = false,
    f = 0;
  while ( --g >= 0 ) {
    var a = ( e == 8 ) ? h[ g ] & 255 : intAt( h, g );
    if ( a < 0 ) {
      if ( h.charAt( g ) == "-" ) {
        d = true
      }
      continue
    }
    d = false;
    if ( f == 0 ) {
      this[ this.t++ ] = a
    } else {
      if ( f + e > this.DB ) {
        this[ this.t - 1 ] |= ( a & ( ( 1 << ( this.DB - f ) ) - 1 ) ) << f;
        this[ this.t++ ] = ( a >> ( this.DB - f ) )
      } else {
        this[ this.t - 1 ] |= a << f
      }
    }
    f += e;
    if ( f >= this.DB ) {
      f -= this.DB
    }
  }
  if ( e == 8 && ( h[ 0 ] & 128 ) != 0 ) {
    this.s = -1;
    if ( f > 0 ) {
      this[ this.t - 1 ] |= ( ( 1 << ( this.DB - f ) ) - 1 ) << f
    }
  }
  this.clamp();
  if ( d ) {
    BigInteger.ZERO.subTo( this, this )
  }
}

function bnpClamp() {
  var a = this.s & this.DM;
  while ( this.t > 0 && this[ this.t - 1 ] == a ) {
    --this.t
  }
}

function bnToString( c ) {
  if ( this.s < 0 ) {
    return "-" + this.negate().toString( c )
  }
  var e;
  if ( c == 16 ) {
    e = 4
  } else {
    if ( c == 8 ) {
      e = 3
    } else {
      if ( c == 2 ) {
        e = 1
      } else {
        if ( c == 32 ) {
          e = 5
        } else {
          if ( c == 4 ) {
            e = 2
          } else {
            return this.toRadix( c )
          }
        }
      }
    }
  }
  var g = ( 1 << e ) - 1,
    l, a = false,
    h = "",
    f = this.t;
  var j = this.DB - ( f * this.DB ) % e;
  if ( f-- > 0 ) {
    if ( j < this.DB && ( l = this[ f ] >> j ) > 0 ) {
      a = true;
      h = int2char( l )
    }
    while ( f >= 0 ) {
      if ( j < e ) {
        l = ( this[ f ] & ( ( 1 << j ) - 1 ) ) << ( e - j );
        l |= this[ --f ] >> ( j += this.DB - e )
      } else {
        l = ( this[ f ] >> ( j -= e ) ) & g;
        if ( j <= 0 ) {
          j += this.DB;
          --f
        }
      } if ( l > 0 ) {
        a = true
      }
      if ( a ) {
        h += int2char( l )
      }
    }
  }
  return a ? h : "0"
}

function bnNegate() {
  var a = nbi();
  BigInteger.ZERO.subTo( this, a );
  return a
}

function bnAbs() {
  return ( this.s < 0 ) ? this.negate() : this
}

function bnCompareTo( b ) {
  var d = this.s - b.s;
  if ( d != 0 ) {
    return d
  }
  var c = this.t;
  d = c - b.t;
  if ( d != 0 ) {
    return ( this.s < 0 ) ? -d : d
  }
  while ( --c >= 0 ) {
    if ( ( d = this[ c ] - b[ c ] ) != 0 ) {
      return d
    }
  }
  return 0
}

function nbits( a ) {
  var c = 1,
    b;
  if ( ( b = a >>> 16 ) != 0 ) {
    a = b;
    c += 16
  }
  if ( ( b = a >> 8 ) != 0 ) {
    a = b;
    c += 8
  }
  if ( ( b = a >> 4 ) != 0 ) {
    a = b;
    c += 4
  }
  if ( ( b = a >> 2 ) != 0 ) {
    a = b;
    c += 2
  }
  if ( ( b = a >> 1 ) != 0 ) {
    a = b;
    c += 1
  }
  return c
}

function bnBitLength() {
  if ( this.t <= 0 ) {
    return 0
  }
  return this.DB * ( this.t - 1 ) + nbits( this[ this.t - 1 ] ^ ( this.s & this.DM ) )
}

function bnpDLShiftTo( c, b ) {
  var a;
  for ( a = this.t - 1; a >= 0; --a ) {
    b[ a + c ] = this[ a ]
  }
  for ( a = c - 1; a >= 0; --a ) {
    b[ a ] = 0
  }
  b.t = this.t + c;
  b.s = this.s
}

function bnpDRShiftTo( c, b ) {
  for ( var a = c; a < this.t; ++a ) {
    b[ a - c ] = this[ a ]
  }
  b.t = Math.max( this.t - c, 0 );
  b.s = this.s
}

function bnpLShiftTo( j, e ) {
  var b = j % this.DB;
  var a = this.DB - b;
  var g = ( 1 << a ) - 1;
  var f = Math.floor( j / this.DB ),
    h = ( this.s << b ) & this.DM,
    d;
  for ( d = this.t - 1; d >= 0; --d ) {
    e[ d + f + 1 ] = ( this[ d ] >> a ) | h;
    h = ( this[ d ] & g ) << b
  }
  for ( d = f - 1; d >= 0; --d ) {
    e[ d ] = 0
  }
  e[ f ] = h;
  e.t = this.t + f + 1;
  e.s = this.s;
  e.clamp()
}

function bnpRShiftTo( g, d ) {
  d.s = this.s;
  var e = Math.floor( g / this.DB );
  if ( e >= this.t ) {
    d.t = 0;
    return
  }
  var b = g % this.DB;
  var a = this.DB - b;
  var f = ( 1 << b ) - 1;
  d[ 0 ] = this[ e ] >> b;
  for ( var c = e + 1; c < this.t; ++c ) {
    d[ c - e - 1 ] |= ( this[ c ] & f ) << a;
    d[ c - e ] = this[ c ] >> b
  }
  if ( b > 0 ) {
    d[ this.t - e - 1 ] |= ( this.s & f ) << a
  }
  d.t = this.t - e;
  d.clamp()
}

function bnpSubTo( d, f ) {
  var e = 0,
    g = 0,
    b = Math.min( d.t, this.t );
  while ( e < b ) {
    g += this[ e ] - d[ e ];
    f[ e++ ] = g & this.DM;
    g >>= this.DB
  }
  if ( d.t < this.t ) {
    g -= d.s;
    while ( e < this.t ) {
      g += this[ e ];
      f[ e++ ] = g & this.DM;
      g >>= this.DB
    }
    g += this.s
  } else {
    g += this.s;
    while ( e < d.t ) {
      g -= d[ e ];
      f[ e++ ] = g & this.DM;
      g >>= this.DB
    }
    g -= d.s
  }
  f.s = ( g < 0 ) ? -1 : 0;
  if ( g < -1 ) {
    f[ e++ ] = this.DV + g
  } else {
    if ( g > 0 ) {
      f[ e++ ] = g
    }
  }
  f.t = e;
  f.clamp()
}

function bnpMultiplyTo( c, e ) {
  var b = this.abs(),
    f = c.abs();
  var d = b.t;
  e.t = d + f.t;
  while ( --d >= 0 ) {
    e[ d ] = 0
  }
  for ( d = 0; d < f.t; ++d ) {
    e[ d + b.t ] = b.am( 0, f[ d ], e, d, 0, b.t )
  }
  e.s = 0;
  e.clamp();
  if ( this.s != c.s ) {
    BigInteger.ZERO.subTo( e, e )
  }
}

function bnpSquareTo( d ) {
  var a = this.abs();
  var b = d.t = 2 * a.t;
  while ( --b >= 0 ) {
    d[ b ] = 0
  }
  for ( b = 0; b < a.t - 1; ++b ) {
    var e = a.am( b, a[ b ], d, 2 * b, 0, 1 );
    if ( ( d[ b + a.t ] += a.am( b + 1, 2 * a[ b ], d, 2 * b + 1, e, a.t - b - 1 ) ) >= a.DV ) {
      d[ b + a.t ] -= a.DV;
      d[ b + a.t + 1 ] = 1
    }
  }
  if ( d.t > 0 ) {
    d[ d.t - 1 ] += a.am( b, a[ b ], d, 2 * b, 0, 1 )
  }
  d.s = 0;
  d.clamp()
}

function bnpDivRemTo( n, h, g ) {
  var w = n.abs();
  if ( w.t <= 0 ) {
    return
  }
  var k = this.abs();
  if ( k.t < w.t ) {
    if ( h != null ) {
      h.fromInt( 0 )
    }
    if ( g != null ) {
      this.copyTo( g )
    }
    return
  }
  if ( g == null ) {
    g = nbi()
  }
  var d = nbi(),
    a = this.s,
    l = n.s;
  var v = this.DB - nbits( w[ w.t - 1 ] );
  if ( v > 0 ) {
    w.lShiftTo( v, d );
    k.lShiftTo( v, g )
  } else {
    w.copyTo( d );
    k.copyTo( g )
  }
  var p = d.t;
  var b = d[ p - 1 ];
  if ( b == 0 ) {
    return
  }
  var o = b * ( 1 << this.F1 ) + ( ( p > 1 ) ? d[ p - 2 ] >> this.F2 : 0 );
  var A = this.FV / o,
    z = ( 1 << this.F1 ) / o,
    x = 1 << this.F2;
  var u = g.t,
    s = u - p,
    f = ( h == null ) ? nbi() : h;
  d.dlShiftTo( s, f );
  if ( g.compareTo( f ) >= 0 ) {
    g[ g.t++ ] = 1;
    g.subTo( f, g )
  }
  BigInteger.ONE.dlShiftTo( p, f );
  f.subTo( d, d );
  while ( d.t < p ) {
    d[ d.t++ ] = 0
  }
  while ( --s >= 0 ) {
    var c = ( g[ --u ] == b ) ? this.DM : Math.floor( g[ u ] * A + ( g[ u - 1 ] + x ) * z );
    if ( ( g[ u ] += d.am( 0, c, g, s, 0, p ) ) < c ) {
      d.dlShiftTo( s, f );
      g.subTo( f, g );
      while ( g[ u ] < --c ) {
        g.subTo( f, g )
      }
    }
  }
  if ( h != null ) {
    g.drShiftTo( p, h );
    if ( a != l ) {
      BigInteger.ZERO.subTo( h, h )
    }
  }
  g.t = p;
  g.clamp();
  if ( v > 0 ) {
    g.rShiftTo( v, g )
  }
  if ( a < 0 ) {
    BigInteger.ZERO.subTo( g, g )
  }
}

function bnMod( b ) {
  var c = nbi();
  this.abs().divRemTo( b, null, c );
  if ( this.s < 0 && c.compareTo( BigInteger.ZERO ) > 0 ) {
    b.subTo( c, c )
  }
  return c
}

function Classic( a ) {
  this.m = a
}

function cConvert( a ) {
  if ( a.s < 0 || a.compareTo( this.m ) >= 0 ) {
    return a.mod( this.m )
  } else {
    return a
  }
}

function cRevert( a ) {
  return a
}

function cReduce( a ) {
  a.divRemTo( this.m, null, a )
}

function cMulTo( a, c, b ) {
  a.multiplyTo( c, b );
  this.reduce( b )
}

function cSqrTo( a, b ) {
  a.squareTo( b );
  this.reduce( b )
}
Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

function bnpInvDigit() {
  if ( this.t < 1 ) {
    return 0
  }
  var a = this[ 0 ];
  if ( ( a & 1 ) == 0 ) {
    return 0
  }
  var b = a & 3;
  b = ( b * ( 2 - ( a & 15 ) * b ) ) & 15;
  b = ( b * ( 2 - ( a & 255 ) * b ) ) & 255;
  b = ( b * ( 2 - ( ( ( a & 65535 ) * b ) & 65535 ) ) ) & 65535;
  b = ( b * ( 2 - a * b % this.DV ) ) % this.DV;
  return ( b > 0 ) ? this.DV - b : -b
}

function Montgomery( a ) {
  this.m = a;
  this.mp = a.invDigit();
  this.mpl = this.mp & 32767;
  this.mph = this.mp >> 15;
  this.um = ( 1 << ( a.DB - 15 ) ) - 1;
  this.mt2 = 2 * a.t
}

function montConvert( a ) {
  var b = nbi();
  a.abs().dlShiftTo( this.m.t, b );
  b.divRemTo( this.m, null, b );
  if ( a.s < 0 && b.compareTo( BigInteger.ZERO ) > 0 ) {
    this.m.subTo( b, b )
  }
  return b
}

function montRevert( a ) {
  var b = nbi();
  a.copyTo( b );
  this.reduce( b );
  return b
}

function montReduce( a ) {
  while ( a.t <= this.mt2 ) {
    a[ a.t++ ] = 0
  }
  for ( var c = 0; c < this.m.t; ++c ) {
    var b = a[ c ] & 32767;
    var d = ( b * this.mpl + ( ( ( b * this.mph + ( a[ c ] >> 15 ) * this.mpl ) & this.um ) << 15 ) ) & a.DM;
    b = c + this.m.t;
    a[ b ] += this.m.am( 0, d, a, c, 0, this.m.t );
    while ( a[ b ] >= a.DV ) {
      a[ b ] -= a.DV;
      a[ ++b ]++
    }
  }
  a.clamp();
  a.drShiftTo( this.m.t, a );
  if ( a.compareTo( this.m ) >= 0 ) {
    a.subTo( this.m, a )
  }
}

function montSqrTo( a, b ) {
  a.squareTo( b );
  this.reduce( b )
}

function montMulTo( a, c, b ) {
  a.multiplyTo( c, b );
  this.reduce( b )
}
Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

function bnpIsEven() {
  return ( ( this.t > 0 ) ? ( this[ 0 ] & 1 ) : this.s ) == 0
}

function bnpExp( h, j ) {
  if ( h > 4294967295 || h < 1 ) {
    return BigInteger.ONE
  }
  var f = nbi(),
    a = nbi(),
    d = j.convert( this ),
    c = nbits( h ) - 1;
  d.copyTo( f );
  while ( --c >= 0 ) {
    j.sqrTo( f, a );
    if ( ( h & ( 1 << c ) ) > 0 ) {
      j.mulTo( a, d, f )
    } else {
      var b = f;
      f = a;
      a = b
    }
  }
  return j.revert( f )
}

function bnModPowInt( b, a ) {
  var c;
  if ( b < 256 || a.isEven() ) {
    c = new Classic( a )
  } else {
    c = new Montgomery( a )
  }
  return this.exp( b, c )
}
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;
BigInteger.ZERO = nbv( 0 );
BigInteger.ONE = nbv( 1 );

function bnClone() {
  var a = nbi();
  this.copyTo( a );
  return a
}

function bnIntValue() {
  if ( this.s < 0 ) {
    if ( this.t == 1 ) {
      return this[ 0 ] - this.DV
    } else {
      if ( this.t == 0 ) {
        return -1
      }
    }
  } else {
    if ( this.t == 1 ) {
      return this[ 0 ]
    } else {
      if ( this.t == 0 ) {
        return 0
      }
    }
  }
  return ( ( this[ 1 ] & ( ( 1 << ( 32 - this.DB ) ) - 1 ) ) << this.DB ) | this[ 0 ]
}

function bnByteValue() {
  return ( this.t == 0 ) ? this.s : ( this[ 0 ] << 24 ) >> 24
}

function bnShortValue() {
  return ( this.t == 0 ) ? this.s : ( this[ 0 ] << 16 ) >> 16
}

function bnpChunkSize( a ) {
  return Math.floor( Math.LN2 * this.DB / Math.log( a ) )
}

function bnSigNum() {
  if ( this.s < 0 ) {
    return -1
  } else {
    if ( this.t <= 0 || ( this.t == 1 && this[ 0 ] <= 0 ) ) {
      return 0
    } else {
      return 1
    }
  }
}

function bnpToRadix( c ) {
  if ( c == null ) {
    c = 10
  }
  if ( this.signum() == 0 || c < 2 || c > 36 ) {
    return "0"
  }
  var f = this.chunkSize( c );
  var e = Math.pow( c, f );
  var j = nbv( e ),
    k = nbi(),
    h = nbi(),
    g = "";
  this.divRemTo( j, k, h );
  while ( k.signum() > 0 ) {
    g = ( e + h.intValue() ).toString( c ).substr( 1 ) + g;
    k.divRemTo( j, k, h )
  }
  return h.intValue().toString( c ) + g
}

function bnpFromRadix( m, h ) {
  this.fromInt( 0 );
  if ( h == null ) {
    h = 10
  }
  var f = this.chunkSize( h );
  var g = Math.pow( h, f ),
    e = false,
    a = 0,
    l = 0;
  for ( var c = 0; c < m.length; ++c ) {
    var k = intAt( m, c );
    if ( k < 0 ) {
      if ( m.charAt( c ) == "-" && this.signum() == 0 ) {
        e = true
      }
      continue
    }
    l = h * l + k;
    if ( ++a >= f ) {
      this.dMultiply( g );
      this.dAddOffset( l, 0 );
      a = 0;
      l = 0
    }
  }
  if ( a > 0 ) {
    this.dMultiply( Math.pow( h, a ) );
    this.dAddOffset( l, 0 )
  }
  if ( e ) {
    BigInteger.ZERO.subTo( this, this )
  }
}

function bnpFromNumber( f, e, h ) {
  if ( "number" == typeof e ) {
    if ( f < 2 ) {
      this.fromInt( 1 )
    } else {
      this.fromNumber( f, h );
      if ( !this.testBit( f - 1 ) ) {
        this.bitwiseTo( BigInteger.ONE.shiftLeft( f - 1 ), op_or, this )
      }
      if ( this.isEven() ) {
        this.dAddOffset( 1, 0 )
      }
      while ( !this.isProbablePrime( e ) ) {
        this.dAddOffset( 2, 0 );
        if ( this.bitLength() > f ) {
          this.subTo( BigInteger.ONE.shiftLeft( f - 1 ), this )
        }
      }
    }
  } else {
    var d = new Array(),
      g = f & 7;
    d.length = ( f >> 3 ) + 1;
    e.nextBytes( d );
    if ( g > 0 ) {
      d[ 0 ] &= ( ( 1 << g ) - 1 )
    } else {
      d[ 0 ] = 0
    }
    this.fromString( d, 256 )
  }
}

function bnToByteArray() {
  var b = this.t,
    c = new Array();
  c[ 0 ] = this.s;
  var e = this.DB - ( b * this.DB ) % 8,
    f, a = 0;
  if ( b-- > 0 ) {
    if ( e < this.DB && ( f = this[ b ] >> e ) != ( this.s & this.DM ) >> e ) {
      c[ a++ ] = f | ( this.s << ( this.DB - e ) )
    }
    while ( b >= 0 ) {
      if ( e < 8 ) {
        f = ( this[ b ] & ( ( 1 << e ) - 1 ) ) << ( 8 - e );
        f |= this[ --b ] >> ( e += this.DB - 8 )
      } else {
        f = ( this[ b ] >> ( e -= 8 ) ) & 255;
        if ( e <= 0 ) {
          e += this.DB;
          --b
        }
      } if ( ( f & 128 ) != 0 ) {
        f |= -256
      }
      if ( a == 0 && ( this.s & 128 ) != ( f & 128 ) ) {
        ++a
      }
      if ( a > 0 || f != this.s ) {
        c[ a++ ] = f
      }
    }
  }
  return c
}

function bnEquals( b ) {
  return ( this.compareTo( b ) == 0 )
}

function bnMin( b ) {
  return ( this.compareTo( b ) < 0 ) ? this : b
}

function bnMax( b ) {
  return ( this.compareTo( b ) > 0 ) ? this : b
}

function bnpBitwiseTo( c, h, e ) {
  var d, g, b = Math.min( c.t, this.t );
  for ( d = 0; d < b; ++d ) {
    e[ d ] = h( this[ d ], c[ d ] )
  }
  if ( c.t < this.t ) {
    g = c.s & this.DM;
    for ( d = b; d < this.t; ++d ) {
      e[ d ] = h( this[ d ], g )
    }
    e.t = this.t
  } else {
    g = this.s & this.DM;
    for ( d = b; d < c.t; ++d ) {
      e[ d ] = h( g, c[ d ] )
    }
    e.t = c.t
  }
  e.s = h( this.s, c.s );
  e.clamp()
}

function op_and( a, b ) {
  return a & b
}

function bnAnd( b ) {
  var c = nbi();
  this.bitwiseTo( b, op_and, c );
  return c
}

function op_or( a, b ) {
  return a | b
}

function bnOr( b ) {
  var c = nbi();
  this.bitwiseTo( b, op_or, c );
  return c
}

function op_xor( a, b ) {
  return a ^ b
}

function bnXor( b ) {
  var c = nbi();
  this.bitwiseTo( b, op_xor, c );
  return c
}

function op_andnot( a, b ) {
  return a & ~b
}

function bnAndNot( b ) {
  var c = nbi();
  this.bitwiseTo( b, op_andnot, c );
  return c
}

function bnNot() {
  var b = nbi();
  for ( var a = 0; a < this.t; ++a ) {
    b[ a ] = this.DM & ~this[ a ]
  }
  b.t = this.t;
  b.s = ~this.s;
  return b
}

function bnShiftLeft( b ) {
  var a = nbi();
  if ( b < 0 ) {
    this.rShiftTo( -b, a )
  } else {
    this.lShiftTo( b, a )
  }
  return a
}

function bnShiftRight( b ) {
  var a = nbi();
  if ( b < 0 ) {
    this.lShiftTo( -b, a )
  } else {
    this.rShiftTo( b, a )
  }
  return a
}

function lbit( a ) {
  if ( a == 0 ) {
    return -1
  }
  var b = 0;
  if ( ( a & 65535 ) == 0 ) {
    a >>= 16;
    b += 16
  }
  if ( ( a & 255 ) == 0 ) {
    a >>= 8;
    b += 8
  }
  if ( ( a & 15 ) == 0 ) {
    a >>= 4;
    b += 4
  }
  if ( ( a & 3 ) == 0 ) {
    a >>= 2;
    b += 2
  }
  if ( ( a & 1 ) == 0 ) {
    ++b
  }
  return b
}

function bnGetLowestSetBit() {
  for ( var a = 0; a < this.t; ++a ) {
    if ( this[ a ] != 0 ) {
      return a * this.DB + lbit( this[ a ] )
    }
  }
  if ( this.s < 0 ) {
    return this.t * this.DB
  }
  return -1
}

function cbit( a ) {
  var b = 0;
  while ( a != 0 ) {
    a &= a - 1;
    ++b
  }
  return b
}

function bnBitCount() {
  var c = 0,
    a = this.s & this.DM;
  for ( var b = 0; b < this.t; ++b ) {
    c += cbit( this[ b ] ^ a )
  }
  return c
}

function bnTestBit( b ) {
  var a = Math.floor( b / this.DB );
  if ( a >= this.t ) {
    return ( this.s != 0 )
  }
  return ( ( this[ a ] & ( 1 << ( b % this.DB ) ) ) != 0 )
}

function bnpChangeBit( c, b ) {
  var a = BigInteger.ONE.shiftLeft( c );
  this.bitwiseTo( a, b, a );
  return a
}

function bnSetBit( a ) {
  return this.changeBit( a, op_or )
}

function bnClearBit( a ) {
  return this.changeBit( a, op_andnot )
}

function bnFlipBit( a ) {
  return this.changeBit( a, op_xor )
}

function bnpAddTo( d, f ) {
  var e = 0,
    g = 0,
    b = Math.min( d.t, this.t );
  while ( e < b ) {
    g += this[ e ] + d[ e ];
    f[ e++ ] = g & this.DM;
    g >>= this.DB
  }
  if ( d.t < this.t ) {
    g += d.s;
    while ( e < this.t ) {
      g += this[ e ];
      f[ e++ ] = g & this.DM;
      g >>= this.DB
    }
    g += this.s
  } else {
    g += this.s;
    while ( e < d.t ) {
      g += d[ e ];
      f[ e++ ] = g & this.DM;
      g >>= this.DB
    }
    g += d.s
  }
  f.s = ( g < 0 ) ? -1 : 0;
  if ( g > 0 ) {
    f[ e++ ] = g
  } else {
    if ( g < -1 ) {
      f[ e++ ] = this.DV + g
    }
  }
  f.t = e;
  f.clamp()
}

function bnAdd( b ) {
  var c = nbi();
  this.addTo( b, c );
  return c
}

function bnSubtract( b ) {
  var c = nbi();
  this.subTo( b, c );
  return c
}

function bnMultiply( b ) {
  var c = nbi();
  this.multiplyTo( b, c );
  return c
}

function bnSquare() {
  var a = nbi();
  this.squareTo( a );
  return a
}

function bnDivide( b ) {
  var c = nbi();
  this.divRemTo( b, c, null );
  return c
}

function bnRemainder( b ) {
  var c = nbi();
  this.divRemTo( b, null, c );
  return c
}

function bnDivideAndRemainder( b ) {
  var d = nbi(),
    c = nbi();
  this.divRemTo( b, d, c );
  return new Array( d, c )
}

function bnpDMultiply( a ) {
  this[ this.t ] = this.am( 0, a - 1, this, 0, 0, this.t );
  ++this.t;
  this.clamp()
}

function bnpDAddOffset( b, a ) {
  if ( b == 0 ) {
    return
  }
  while ( this.t <= a ) {
    this[ this.t++ ] = 0
  }
  this[ a ] += b;
  while ( this[ a ] >= this.DV ) {
    this[ a ] -= this.DV;
    if ( ++a >= this.t ) {
      this[ this.t++ ] = 0
    }++this[ a ]
  }
}

function NullExp() {}

function nNop( a ) {
  return a
}

function nMulTo( a, c, b ) {
  a.multiplyTo( c, b )
}

function nSqrTo( a, b ) {
  a.squareTo( b )
}
NullExp.prototype.convert = nNop;
NullExp.prototype.revert = nNop;
NullExp.prototype.mulTo = nMulTo;
NullExp.prototype.sqrTo = nSqrTo;

function bnPow( a ) {
  return this.exp( a, new NullExp() )
}

function bnpMultiplyLowerTo( b, f, e ) {
  var d = Math.min( this.t + b.t, f );
  e.s = 0;
  e.t = d;
  while ( d > 0 ) {
    e[ --d ] = 0
  }
  var c;
  for ( c = e.t - this.t; d < c; ++d ) {
    e[ d + this.t ] = this.am( 0, b[ d ], e, d, 0, this.t )
  }
  for ( c = Math.min( b.t, f ); d < c; ++d ) {
    this.am( 0, b[ d ], e, d, 0, f - d )
  }
  e.clamp()
}

function bnpMultiplyUpperTo( b, e, d ) {
  --e;
  var c = d.t = this.t + b.t - e;
  d.s = 0;
  while ( --c >= 0 ) {
    d[ c ] = 0
  }
  for ( c = Math.max( e - this.t, 0 ); c < b.t; ++c ) {
    d[ this.t + c - e ] = this.am( e - c, b[ c ], d, 0, 0, this.t + c - e )
  }
  d.clamp();
  d.drShiftTo( 1, d )
}

function Barrett( a ) {
  this.r2 = nbi();
  this.q3 = nbi();
  BigInteger.ONE.dlShiftTo( 2 * a.t, this.r2 );
  this.mu = this.r2.divide( a );
  this.m = a
}

function barrettConvert( a ) {
  if ( a.s < 0 || a.t > 2 * this.m.t ) {
    return a.mod( this.m )
  } else {
    if ( a.compareTo( this.m ) < 0 ) {
      return a
    } else {
      var b = nbi();
      a.copyTo( b );
      this.reduce( b );
      return b
    }
  }
}

function barrettRevert( a ) {
  return a
}

function barrettReduce( a ) {
  a.drShiftTo( this.m.t - 1, this.r2 );
  if ( a.t > this.m.t + 1 ) {
    a.t = this.m.t + 1;
    a.clamp()
  }
  this.mu.multiplyUpperTo( this.r2, this.m.t + 1, this.q3 );
  this.m.multiplyLowerTo( this.q3, this.m.t + 1, this.r2 );
  while ( a.compareTo( this.r2 ) < 0 ) {
    a.dAddOffset( 1, this.m.t + 1 )
  }
  a.subTo( this.r2, a );
  while ( a.compareTo( this.m ) >= 0 ) {
    a.subTo( this.m, a )
  }
}

function barrettSqrTo( a, b ) {
  a.squareTo( b );
  this.reduce( b )
}

function barrettMulTo( a, c, b ) {
  a.multiplyTo( c, b );
  this.reduce( b )
}
Barrett.prototype.convert = barrettConvert;
Barrett.prototype.revert = barrettRevert;
Barrett.prototype.reduce = barrettReduce;
Barrett.prototype.mulTo = barrettMulTo;
Barrett.prototype.sqrTo = barrettSqrTo;

function bnModPow( q, f ) {
  var o = q.bitLength(),
    h, b = nbv( 1 ),
    v;
  if ( o <= 0 ) {
    return b
  } else {
    if ( o < 18 ) {
      h = 1
    } else {
      if ( o < 48 ) {
        h = 3
      } else {
        if ( o < 144 ) {
          h = 4
        } else {
          if ( o < 768 ) {
            h = 5
          } else {
            h = 6
          }
        }
      }
    }
  } if ( o < 8 ) {
    v = new Classic( f )
  } else {
    if ( f.isEven() ) {
      v = new Barrett( f )
    } else {
      v = new Montgomery( f )
    }
  }
  var p = new Array(),
    d = 3,
    s = h - 1,
    a = ( 1 << h ) - 1;
  p[ 1 ] = v.convert( this );
  if ( h > 1 ) {
    var A = nbi();
    v.sqrTo( p[ 1 ], A );
    while ( d <= a ) {
      p[ d ] = nbi();
      v.mulTo( A, p[ d - 2 ], p[ d ] );
      d += 2
    }
  }
  var l = q.t - 1,
    x, u = true,
    c = nbi(),
    y;
  o = nbits( q[ l ] ) - 1;
  while ( l >= 0 ) {
    if ( o >= s ) {
      x = ( q[ l ] >> ( o - s ) ) & a
    } else {
      x = ( q[ l ] & ( ( 1 << ( o + 1 ) ) - 1 ) ) << ( s - o );
      if ( l > 0 ) {
        x |= q[ l - 1 ] >> ( this.DB + o - s )
      }
    }
    d = h;
    while ( ( x & 1 ) == 0 ) {
      x >>= 1;
      --d
    }
    if ( ( o -= d ) < 0 ) {
      o += this.DB;
      --l
    }
    if ( u ) {
      p[ x ].copyTo( b );
      u = false
    } else {
      while ( d > 1 ) {
        v.sqrTo( b, c );
        v.sqrTo( c, b );
        d -= 2
      }
      if ( d > 0 ) {
        v.sqrTo( b, c )
      } else {
        y = b;
        b = c;
        c = y
      }
      v.mulTo( c, p[ x ], b )
    }
    while ( l >= 0 && ( q[ l ] & ( 1 << o ) ) == 0 ) {
      v.sqrTo( b, c );
      y = b;
      b = c;
      c = y;
      if ( --o < 0 ) {
        o = this.DB - 1;
        --l
      }
    }
  }
  return v.revert( b )
}

function bnGCD( c ) {
  var b = ( this.s < 0 ) ? this.negate() : this.clone();
  var h = ( c.s < 0 ) ? c.negate() : c.clone();
  if ( b.compareTo( h ) < 0 ) {
    var e = b;
    b = h;
    h = e
  }
  var d = b.getLowestSetBit(),
    f = h.getLowestSetBit();
  if ( f < 0 ) {
    return b
  }
  if ( d < f ) {
    f = d
  }
  if ( f > 0 ) {
    b.rShiftTo( f, b );
    h.rShiftTo( f, h )
  }
  while ( b.signum() > 0 ) {
    if ( ( d = b.getLowestSetBit() ) > 0 ) {
      b.rShiftTo( d, b )
    }
    if ( ( d = h.getLowestSetBit() ) > 0 ) {
      h.rShiftTo( d, h )
    }
    if ( b.compareTo( h ) >= 0 ) {
      b.subTo( h, b );
      b.rShiftTo( 1, b )
    } else {
      h.subTo( b, h );
      h.rShiftTo( 1, h )
    }
  }
  if ( f > 0 ) {
    h.lShiftTo( f, h )
  }
  return h
}

function bnpModInt( e ) {
  if ( e <= 0 ) {
    return 0
  }
  var c = this.DV % e,
    b = ( this.s < 0 ) ? e - 1 : 0;
  if ( this.t > 0 ) {
    if ( c == 0 ) {
      b = this[ 0 ] % e
    } else {
      for ( var a = this.t - 1; a >= 0; --a ) {
        b = ( c * b + this[ a ] ) % e
      }
    }
  }
  return b
}

function bnModInverse( f ) {
  var k = f.isEven();
  if ( ( this.isEven() && k ) || f.signum() == 0 ) {
    return BigInteger.ZERO
  }
  var j = f.clone(),
    h = this.clone();
  var g = nbv( 1 ),
    e = nbv( 0 ),
    n = nbv( 0 ),
    l = nbv( 1 );
  while ( j.signum() != 0 ) {
    while ( j.isEven() ) {
      j.rShiftTo( 1, j );
      if ( k ) {
        if ( !g.isEven() || !e.isEven() ) {
          g.addTo( this, g );
          e.subTo( f, e )
        }
        g.rShiftTo( 1, g )
      } else {
        if ( !e.isEven() ) {
          e.subTo( f, e )
        }
      }
      e.rShiftTo( 1, e )
    }
    while ( h.isEven() ) {
      h.rShiftTo( 1, h );
      if ( k ) {
        if ( !n.isEven() || !l.isEven() ) {
          n.addTo( this, n );
          l.subTo( f, l )
        }
        n.rShiftTo( 1, n )
      } else {
        if ( !l.isEven() ) {
          l.subTo( f, l )
        }
      }
      l.rShiftTo( 1, l )
    }
    if ( j.compareTo( h ) >= 0 ) {
      j.subTo( h, j );
      if ( k ) {
        g.subTo( n, g )
      }
      e.subTo( l, e )
    } else {
      h.subTo( j, h );
      if ( k ) {
        n.subTo( g, n )
      }
      l.subTo( e, l )
    }
  }
  if ( h.compareTo( BigInteger.ONE ) != 0 ) {
    return BigInteger.ZERO
  }
  if ( l.compareTo( f ) >= 0 ) {
    return l.subtract( f )
  }
  if ( l.signum() < 0 ) {
    l.addTo( f, l )
  } else {
    return l
  } if ( l.signum() < 0 ) {
    return l.add( f )
  } else {
    return l
  }
}
var lowprimes = [ 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997 ];
var lplim = ( 1 << 26 ) / lowprimes[ lowprimes.length - 1 ];

function bnIsProbablePrime( e ) {
  var d, b = this.abs();
  if ( b.t == 1 && b[ 0 ] <= lowprimes[ lowprimes.length - 1 ] ) {
    for ( d = 0; d < lowprimes.length; ++d ) {
      if ( b[ 0 ] == lowprimes[ d ] ) {
        return true
      }
    }
    return false
  }
  if ( b.isEven() ) {
    return false
  }
  d = 1;
  while ( d < lowprimes.length ) {
    var a = lowprimes[ d ],
      c = d + 1;
    while ( c < lowprimes.length && a < lplim ) {
      a *= lowprimes[ c++ ]
    }
    a = b.modInt( a );
    while ( d < c ) {
      if ( a % lowprimes[ d++ ] == 0 ) {
        return false
      }
    }
  }
  return b.millerRabin( e )
}

function bnpMillerRabin( f ) {
  var g = this.subtract( BigInteger.ONE );
  var c = g.getLowestSetBit();
  if ( c <= 0 ) {
    return false
  }
  var h = g.shiftRight( c );
  f = ( f + 1 ) >> 1;
  if ( f > lowprimes.length ) {
    f = lowprimes.length
  }
  var b = nbi();
  for ( var e = 0; e < f; ++e ) {
    b.fromInt( lowprimes[ Math.floor( Math.random() * lowprimes.length ) ] );
    var l = b.modPow( h, this );
    if ( l.compareTo( BigInteger.ONE ) != 0 && l.compareTo( g ) != 0 ) {
      var d = 1;
      while ( d++ < c && l.compareTo( g ) != 0 ) {
        l = l.modPowInt( 2, this );
        if ( l.compareTo( BigInteger.ONE ) == 0 ) {
          return false
        }
      }
      if ( l.compareTo( g ) != 0 ) {
        return false
      }
    }
  }
  return true
}
BigInteger.prototype.chunkSize = bnpChunkSize;
BigInteger.prototype.toRadix = bnpToRadix;
BigInteger.prototype.fromRadix = bnpFromRadix;
BigInteger.prototype.fromNumber = bnpFromNumber;
BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
BigInteger.prototype.changeBit = bnpChangeBit;
BigInteger.prototype.addTo = bnpAddTo;
BigInteger.prototype.dMultiply = bnpDMultiply;
BigInteger.prototype.dAddOffset = bnpDAddOffset;
BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
BigInteger.prototype.modInt = bnpModInt;
BigInteger.prototype.millerRabin = bnpMillerRabin;
BigInteger.prototype.clone = bnClone;
BigInteger.prototype.intValue = bnIntValue;
BigInteger.prototype.byteValue = bnByteValue;
BigInteger.prototype.shortValue = bnShortValue;
BigInteger.prototype.signum = bnSigNum;
BigInteger.prototype.toByteArray = bnToByteArray;
BigInteger.prototype.equals = bnEquals;
BigInteger.prototype.min = bnMin;
BigInteger.prototype.max = bnMax;
BigInteger.prototype.and = bnAnd;
BigInteger.prototype.or = bnOr;
BigInteger.prototype.xor = bnXor;
BigInteger.prototype.andNot = bnAndNot;
BigInteger.prototype.not = bnNot;
BigInteger.prototype.shiftLeft = bnShiftLeft;
BigInteger.prototype.shiftRight = bnShiftRight;
BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
BigInteger.prototype.bitCount = bnBitCount;
BigInteger.prototype.testBit = bnTestBit;
BigInteger.prototype.setBit = bnSetBit;
BigInteger.prototype.clearBit = bnClearBit;
BigInteger.prototype.flipBit = bnFlipBit;
BigInteger.prototype.add = bnAdd;
BigInteger.prototype.subtract = bnSubtract;
BigInteger.prototype.multiply = bnMultiply;
BigInteger.prototype.divide = bnDivide;
BigInteger.prototype.remainder = bnRemainder;
BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
BigInteger.prototype.modPow = bnModPow;
BigInteger.prototype.modInverse = bnModInverse;
BigInteger.prototype.pow = bnPow;
BigInteger.prototype.gcd = bnGCD;
BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
BigInteger.prototype.square = bnSquare;

function Arcfour() {
  this.i = 0;
  this.j = 0;
  this.S = new Array()
}

function ARC4init( d ) {
  var c, a, b;
  for ( c = 0; c < 256; ++c ) {
    this.S[ c ] = c
  }
  a = 0;
  for ( c = 0; c < 256; ++c ) {
    a = ( a + this.S[ c ] + d[ c % d.length ] ) & 255;
    b = this.S[ c ];
    this.S[ c ] = this.S[ a ];
    this.S[ a ] = b
  }
  this.i = 0;
  this.j = 0
}

function ARC4next() {
  var a;
  this.i = ( this.i + 1 ) & 255;
  this.j = ( this.j + this.S[ this.i ] ) & 255;
  a = this.S[ this.i ];
  this.S[ this.i ] = this.S[ this.j ];
  this.S[ this.j ] = a;
  return this.S[ ( a + this.S[ this.i ] ) & 255 ]
}
Arcfour.prototype.init = ARC4init;
Arcfour.prototype.next = ARC4next;

function prng_newstate() {
  return new Arcfour()
}
var rng_psize = 256;
var rng_state;
var rng_pool;
var rng_pptr;

function rng_seed_int( a ) {
  rng_pool[ rng_pptr++ ] ^= a & 255;
  rng_pool[ rng_pptr++ ] ^= ( a >> 8 ) & 255;
  rng_pool[ rng_pptr++ ] ^= ( a >> 16 ) & 255;
  rng_pool[ rng_pptr++ ] ^= ( a >> 24 ) & 255;
  if ( rng_pptr >= rng_psize ) {
    rng_pptr -= rng_psize
  }
}

function rng_seed_time() {
  rng_seed_int( new Date().getTime() )
}
if ( rng_pool == null ) {
  rng_pool = new Array();
  rng_pptr = 0;
  var t;
  if ( _window.crypto && _window.crypto.getRandomValues && typeof Int32Array != "undefined" ) {
    var word_array = new Int32Array( 32 );
    _window.crypto.getRandomValues( word_array );
    for ( t = 0; t < word_array.length; ++t ) {
      rng_seed_int( word_array[ t ] )
    }
  } else {
    while ( rng_pptr < rng_psize ) {
      t = Math.floor( 65536 * Math.random() );
      rng_pool[ rng_pptr++ ] = t >>> 8;
      rng_pool[ rng_pptr++ ] = t & 255
    }
  }
  rng_pptr = 0;
  rng_seed_time()
}

function rng_get_byte() {
  if ( rng_state == null ) {
    rng_seed_time();
    rng_state = prng_newstate();
    rng_state.init( rng_pool );
    for ( rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr ) {
      rng_pool[ rng_pptr ] = 0
    }
    rng_pptr = 0
  }
  return rng_state.next()
}

function rng_get_bytes( b ) {
  var a;
  for ( a = 0; a < b.length; ++a ) {
    b[ a ] = rng_get_byte()
  }
}

function SecureRandom() {}
SecureRandom.prototype.nextBytes = rng_get_bytes;

function X9ECParameters( c, b, d, a ) {
  this.curve = c;
  this.g = b;
  this.n = d;
  this.h = a
}

function x9getCurve() {
  return this.curve
}

function x9getG() {
  return this.g
}

function x9getN() {
  return this.n
}

function x9getH() {
  return this.h
}
X9ECParameters.prototype.getCurve = x9getCurve;
X9ECParameters.prototype.getG = x9getG;
X9ECParameters.prototype.getN = x9getN;
X9ECParameters.prototype.getH = x9getH;

function fromHex( a ) {
  return new BigInteger( a, 16 )
}

function secp256k1() {
  var g = fromHex( "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F" );
  var d = BigInteger.ZERO;
  var c = fromHex( "7" );
  var k = fromHex( "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141" );
  var f = BigInteger.ONE;
  var j = new ECCurveFp( g, d, c );
  var e = j.decodePointHex( "0479BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8" );
  return new X9ECParameters( j, e, k, f )
}
var Bitcoin = {};
BigInteger.valueOf = function( a ) {
  if ( !a ) {
    return BigInteger.ZERO
  }
  return new BigInteger( "" + a, 10 )
};
BigInteger.prototype.toByteArrayUnsigned = function() {
  var a = this.abs().toByteArray();
  if ( a.length ) {
    if ( a[ 0 ] == 0 ) {
      a = a.slice( 1 )
    }
    return a.map( function( b ) {
      return ( b < 0 ) ? b + 256 : b
    } )
  } else {
    return a
  }
};
BigInteger.fromByteArrayUnsigned = function( a ) {
  if ( !a.length ) {
    return a.valueOf( 0 )
  } else {
    if ( a[ 0 ] & 128 ) {
      return new BigInteger( [ 0 ].concat( a ) )
    } else {
      return new BigInteger( a )
    }
  }
};
BigInteger.prototype.toByteArraySigned = function() {
  var a = this.abs().toByteArrayUnsigned();
  var b = this.compareTo( BigInteger.ZERO ) < 0;
  if ( b ) {
    if ( a[ 0 ] & 128 ) {
      a.unshift( 128 )
    } else {
      a[ 0 ] |= 128
    }
  } else {
    if ( a[ 0 ] & 128 ) {
      a.unshift( 0 )
    }
  }
  return a
};
BigInteger.fromByteArraySigned = function( a ) {
  if ( a[ 0 ] & 128 ) {
    a[ 0 ] &= 127;
    return BigInteger.fromByteArrayUnsigned( a ).negate()
  } else {
    return BigInteger.fromByteArrayUnsigned( a )
  }
};
Bitcoin.Util = {
  isArray: Array.isArray || function( a ) {
    return Object.prototype.toString.call( a ) === "[object Array]"
  },
  makeFilledArray: function( a, c ) {
    var d = [];
    var b = 0;
    while ( b < a ) {
      d[ b++ ] = c
    }
    return d
  },
  numToVarInt: function( a ) {
    if ( a < 253 ) {
      return [ a ]
    } else {
      if ( a <= 1 << 16 ) {
        return [ 253, a >>> 8, a & 255 ]
      } else {
        if ( a <= 1 << 32 ) {
          return [ 254 ].concat( Crypto.util.wordsToBytes( [ a ] ) )
        } else {
          return [ 255 ].concat( Crypto.util.wordsToBytes( [ a >>> 32, a ] ) )
        }
      }
    }
  },
  valueToBigInt: function( a ) {
    if ( a instanceof BigInteger ) {
      return a
    }
    return BigInteger.fromByteArrayUnsigned( a )
  },
  formatValue: function( a ) {
    var c = this.valueToBigInt( a ).toString();
    var d = c.length > 8 ? c.substr( 0, c.length - 8 ) : "0";
    var b = c.length > 8 ? c.substr( c.length - 8 ) : c;
    while ( b.length < 8 ) {
      b = "0" + b
    }
    b = b.replace( /0*$/, "" );
    while ( b.length < 2 ) {
      b += "0"
    }
    return d + "." + b
  },
  parseValue: function( a ) {
    if ( !a ) {
      return BigInteger.ZERO
    }
    a = "" + a;
    if ( !/^[\d.]+$/.test( a ) ) {
      return BigInteger.ZERO
    }
    var d = a.split( "." );
    var e = d[ 0 ];
    var b = d[ 1 ] || "0";
    b = b.length > 8 ? b.substr( 0, 8 ) : b;
    while ( b.length < 8 ) {
      b += "0"
    }
    b = b.replace( /^0+/g, "" );
    var c = BigInteger.valueOf( e );
    c = c.multiply( BigInteger.valueOf( 100000000 ) );
    c = c.add( BigInteger.valueOf( b ) );
    return c
  },
  sha256ripe160: function( a ) {
    return Crypto.RIPEMD160( Crypto.SHA256( a, {
      asBytes: true
    } ), {
      asBytes: true
    } )
  }
};
for ( var i in Crypto.util ) {
  if ( Crypto.util.hasOwnProperty( i ) ) {
    Bitcoin.Util[ i ] = Crypto.util[ i ]
  }
}
var B58 = {
  alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
  base: BigInteger.valueOf( 58 ),
  encode: function( b ) {
    var a = BigInteger.fromByteArrayUnsigned( b );
    var e = [];
    while ( a.compareTo( B58.base ) >= 0 ) {
      var d = a.mod( B58.base );
      e.unshift( B58.alphabet[ d.intValue() ] );
      a = a.subtract( d ).divide( B58.base )
    }
    e.unshift( B58.alphabet[ a.intValue() ] );
    for ( var c = 0; c < b.length; c++ ) {
      if ( b[ c ] == 0 ) {
        e.unshift( B58.alphabet[ 0 ] )
      } else {
        break
      }
    }
    return e.join( "" )
  },
  decode: function( c ) {
    var b = BigInteger.valueOf( 0 );
    var e = 0;
    for ( var d = c.length - 1; d >= 0; d-- ) {
      var f = B58.alphabet.indexOf( c[ d ] );
      b = b.add( BigInteger.valueOf( f ).multiply( B58.base.pow( c.length - 1 - d ) ) );
      if ( c[ d ] == "1" ) {
        e++
      } else {
        e = 0
      }
    }
    var a = b.toByteArrayUnsigned();
    while ( e-- > 0 ) {
      a.unshift( 0 )
    }
    return a
  }
};
Bitcoin.Base58 = B58;
Bitcoin.Address = function( a ) {
  if ( "string" == typeof a ) {
    a = Bitcoin.Address.decodeString( a )
  }
  this.hash = a;
  this.version = 0
};
Bitcoin.Address.prototype.toString = function() {
  var c = this.hash.slice( 0 );
  c.unshift( this.version );
  var b = Crypto.SHA256( Crypto.SHA256( c, {
    asBytes: true
  } ), {
    asBytes: true
  } );
  var a = c.concat( b.slice( 0, 4 ) );
  return Bitcoin.Base58.encode( a )
};
Bitcoin.Address.prototype.getHashBase64 = function() {
  return Crypto.util.bytesToBase64( this.hash )
};
Bitcoin.Address.decodeString = function( c ) {
  var b = Bitcoin.Base58.decode( c );
  var e = b.slice( 0, 21 );
  var d = Crypto.SHA256( Crypto.SHA256( e, {
    asBytes: true
  } ), {
    asBytes: true
  } );
  if ( d[ 0 ] != b[ 21 ] || d[ 1 ] != b[ 22 ] || d[ 2 ] != b[ 23 ] || d[ 3 ] != b[ 24 ] ) {
    throw "Checksum validation failed!"
  }
  var a = e.shift();
  if ( a != 0 ) {
    throw "Version " + a + " not supported!"
  }
  return e
};

function integerToBytes( c, a ) {
  var b = c.toByteArrayUnsigned();
  if ( a < b.length ) {
    b = b.slice( b.length - a )
  } else {
    while ( a > b.length ) {
      b.unshift( 0 )
    }
  }
  return b
}
ECFieldElementFp.prototype.getByteLength = function() {
  return Math.floor( ( this.toBigInteger().bitLength() + 7 ) / 8 )
};
ECPointFp.prototype.getEncoded = function( c ) {
  var a = this.getX().toBigInteger();
  var d = this.getY().toBigInteger();
  var b = integerToBytes( a, 32 );
  if ( c ) {
    if ( d.isEven() ) {
      b.unshift( 2 )
    } else {
      b.unshift( 3 )
    }
  } else {
    b.unshift( 4 );
    b = b.concat( integerToBytes( d, 32 ) )
  }
  return b
};
ECPointFp.decodeFrom = function( g, c ) {
  var f = c[ 0 ];
  var e = c.length - 1;
  var d = c.slice( 1, 1 + e / 2 );
  var b = c.slice( 1 + e / 2, 1 + e );
  d.unshift( 0 );
  b.unshift( 0 );
  var a = new BigInteger( d );
  var h = new BigInteger( b );
  return new ECPointFp( g, g.fromBigInteger( a ), g.fromBigInteger( h ) )
};
ECPointFp.prototype.add2D = function( c ) {
  if ( this.isInfinity() ) {
    return c
  }
  if ( c.isInfinity() ) {
    return this
  }
  if ( this.x.equals( c.x ) ) {
    if ( this.y.equals( c.y ) ) {
      return this.twice()
    }
    return this.curve.getInfinity()
  }
  var g = c.x.subtract( this.x );
  var e = c.y.subtract( this.y );
  var a = e.divide( g );
  var d = a.square().subtract( this.x ).subtract( c.x );
  var f = a.multiply( this.x.subtract( d ) ).subtract( this.y );
  return new ECPointFp( this.curve, d, f )
};
ECPointFp.prototype.twice2D = function() {
  if ( this.isInfinity() ) {
    return this
  }
  if ( this.y.toBigInteger().signum() == 0 ) {
    return this.curve.getInfinity()
  }
  var b = this.curve.fromBigInteger( BigInteger.valueOf( 2 ) );
  var e = this.curve.fromBigInteger( BigInteger.valueOf( 3 ) );
  var a = this.x.square().multiply( e ).add( this.curve.a ).divide( this.y.multiply( b ) );
  var c = a.square().subtract( this.x.multiply( b ) );
  var d = a.multiply( this.x.subtract( c ) ).subtract( this.y );
  return new ECPointFp( this.curve, c, d )
};
ECPointFp.prototype.multiply2D = function( b ) {
  if ( this.isInfinity() ) {
    return this
  }
  if ( b.signum() == 0 ) {
    return this.curve.getInfinity()
  }
  var g = b;
  var f = g.multiply( new BigInteger( "3" ) );
  var l = this.negate();
  var d = this;
  var c;
  for ( c = f.bitLength() - 2; c > 0; --c ) {
    d = d.twice();
    var a = f.testBit( c );
    var j = g.testBit( c );
    if ( a != j ) {
      d = d.add2D( a ? this : l )
    }
  }
  return d
};
ECPointFp.prototype.isOnCurve = function() {
  var d = this.getX().toBigInteger();
  var j = this.getY().toBigInteger();
  var f = this.curve.getA().toBigInteger();
  var c = this.curve.getB().toBigInteger();
  var h = this.curve.getQ();
  var e = j.multiply( j ).mod( h );
  var g = d.multiply( d ).multiply( d ).add( f.multiply( d ) ).add( c ).mod( h );
  return e.equals( g )
};
ECPointFp.prototype.toString = function() {
  return "(" + this.getX().toBigInteger().toString() + "," + this.getY().toBigInteger().toString() + ")"
};
ECPointFp.prototype.validate = function() {
  var c = this.curve.getQ();
  if ( this.isInfinity() ) {
    throw new Error( "Point is at infinity." )
  }
  var a = this.getX().toBigInteger();
  var b = this.getY().toBigInteger();
  if ( a.compareTo( BigInteger.ONE ) < 0 || a.compareTo( c.subtract( BigInteger.ONE ) ) > 0 ) {
    throw new Error( "x coordinate out of bounds" )
  }
  if ( b.compareTo( BigInteger.ONE ) < 0 || b.compareTo( c.subtract( BigInteger.ONE ) ) > 0 ) {
    throw new Error( "y coordinate out of bounds" )
  }
  if ( !this.isOnCurve() ) {
    throw new Error( "Point is not on the curve." )
  }
  if ( this.multiply( c ).isInfinity() ) {
    throw new Error( "Point is not a scalar multiple of G." )
  }
  return true
};

function dmp( a ) {
  if ( !( a instanceof BigInteger ) ) {
    a = a.toBigInteger()
  }
  return Crypto.util.bytesToHex( a.toByteArrayUnsigned() )
}
Bitcoin.ECDSA = ( function() {
  var e = secp256k1();
  var a = new SecureRandom();
  var d = null;

  function b( p, h, o, g ) {
    var f = Math.max( h.bitLength(), g.bitLength() );
    var q = p.add2D( o );
    var n = p.curve.getInfinity();
    for ( var j = f - 1; j >= 0; --j ) {
      n = n.twice2D();
      n.z = BigInteger.ONE;
      if ( h.testBit( j ) ) {
        if ( g.testBit( j ) ) {
          n = n.add2D( q )
        } else {
          n = n.add2D( p )
        }
      } else {
        if ( g.testBit( j ) ) {
          n = n.add2D( o )
        }
      }
    }
    return n
  }
  var c = {
    getBigRandom: function( f ) {
      return new BigInteger( f.bitLength(), a ).mod( f.subtract( BigInteger.ONE ) ).add( BigInteger.ONE )
    },
    sign: function( j, q ) {
      var o = q;
      var g = e.getN();
      var m = BigInteger.fromByteArrayUnsigned( j );
      do {
        var h = c.getBigRandom( g );
        var p = e.getG();
        var l = p.multiply( h );
        var f = l.getX().toBigInteger().mod( g )
      } while ( f.compareTo( BigInteger.ZERO ) <= 0 );
      var u = h.modInverse( g ).multiply( m.add( o.multiply( f ) ) ).mod( g );
      return {
        r: f,
        s: u
      }
    },
    verify: function( m, n, g ) {
      var j, f;
      if ( Bitcoin.Util.isArray( n ) ) {
        var l = c.parseSig( n );
        j = l.r;
        f = l.s
      } else {
        if ( "object" === typeof n && n.r && n.s ) {
          j = n.r;
          f = n.s
        } else {
          throw "Invalid value for signature"
        }
      }
      var h;
      if ( g instanceof ECPointFp ) {
        h = g
      } else {
        if ( Bitcoin.Util.isArray( g ) ) {
          h = ECPointFp.decodeFrom( e.getCurve(), g )
        } else {
          throw "Invalid format for pubkey value, must be byte array or ECPointFp"
        }
      }
      var k = BigInteger.fromByteArrayUnsigned( m );
      return c.verifyRaw( k, j, f, h )
    },
    verifyRaw: function( l, f, u, k ) {
      var j = e.getN();
      var q = e.getG();
      if ( f.compareTo( BigInteger.ONE ) < 0 || f.compareTo( j ) >= 0 ) {
        return false
      }
      if ( u.compareTo( BigInteger.ONE ) < 0 || u.compareTo( j ) >= 0 ) {
        return false
      }
      var m = u.modInverse( j );
      var h = l.multiply( m ).mod( j );
      var g = f.multiply( m ).mod( j );
      var o = q.multiply( h ).add( k.multiply( g ) );
      var p = o.getX().toBigInteger().mod( j );
      return p.equals( f )
    },
    serializeSig: function( h, g ) {
      var j = h.toByteArraySigned();
      var f = g.toByteArraySigned();
      var k = [];
      k.push( 2 );
      k.push( j.length );
      k = k.concat( j );
      k.push( 2 );
      k.push( f.length );
      k = k.concat( f );
      k.unshift( k.length );
      k.unshift( 48 );
      return k
    },
    parseSig: function( l ) {
      var k;
      if ( l[ 0 ] != 48 ) {
        throw new Error( "Signature not a valid DERSequence" )
      }
      k = 2;
      if ( l[ k ] != 2 ) {
        throw new Error( "First element in signature must be a DERInteger" )
      }
      var j = l.slice( k + 2, k + 2 + l[ k + 1 ] );
      k += 2 + l[ k + 1 ];
      if ( l[ k ] != 2 ) {
        throw new Error( "Second element in signature must be a DERInteger" )
      }
      var f = l.slice( k + 2, k + 2 + l[ k + 1 ] );
      k += 2 + l[ k + 1 ];
      var h = BigInteger.fromByteArrayUnsigned( j );
      var g = BigInteger.fromByteArrayUnsigned( f );
      return {
        r: h,
        s: g
      }
    },
    parseSigCompact: function( j ) {
      if ( j.length !== 65 ) {
        throw "Signature has the wrong length"
      }
      var f = j[ 0 ] - 27;
      if ( f < 0 || f > 7 ) {
        throw "Invalid signature type"
      }
      var k = e.getN();
      var h = BigInteger.fromByteArrayUnsigned( j.slice( 1, 33 ) ).mod( k );
      var g = BigInteger.fromByteArrayUnsigned( j.slice( 33, 65 ) ).mod( k );
      return {
        r: h,
        s: g,
        i: f
      }
    },
    recoverPubKey: function( w, v, f, D ) {
      D = D & 3;
      var m = D & 1;
      var I = D >> 1;
      var B = e.getN();
      var u = e.getG();
      var z = e.getCurve();
      var A = z.getQ();
      var M = z.getA().toBigInteger();
      var L = z.getB().toBigInteger();
      if ( !d ) {
        d = A.add( BigInteger.ONE ).divide( BigInteger.valueOf( 4 ) )
      }
      var q = I ? w.add( B ) : w;
      var g = q.multiply( q ).multiply( q ).add( M.multiply( q ) ).add( L ).mod( A );
      var J = g.modPow( d, A );
      var H = J.isEven() ? ( D % 2 ) : ( ( D + 1 ) % 2 );
      var o = ( J.isEven() ? !m : m ) ? J : A.subtract( J );
      var h = new ECPointFp( z, z.fromBigInteger( q ), z.fromBigInteger( o ) );
      h.validate();
      var F = BigInteger.fromByteArrayUnsigned( f );
      var l = BigInteger.ZERO.subtract( F ).mod( B );
      var k = w.modInverse( B );
      var j = b( h, v, u, l ).multiply( k );
      j.validate();
      if ( !c.verifyRaw( F, w, v, j ) ) {
        throw "Pubkey recovery unsuccessful"
      }
      var E = new Bitcoin.ECKey();
      E.pub = j;
      return E
    },
    calcPubkeyRecoveryParam: function( f, k, j, m ) {
      for ( var g = 0; g < 4; g++ ) {
        try {
          var h = Bitcoin.ECDSA.recoverPubKey( k, j, m, g );
          if ( h.getBitcoinAddress().toString() == f ) {
            return g
          }
        } catch ( l ) {}
      }
      throw "Unable to find valid recovery factor"
    }
  };
  return c
} )();
Bitcoin.ECKey = ( function() {
  var c = Bitcoin.ECDSA;
  var d = secp256k1();
  var a = new SecureRandom();
  var b = function( e ) {
    if ( !e ) {
      var f = d.getN();
      this.priv = c.getBigRandom( f )
    } else {
      if ( e instanceof BigInteger ) {
        this.priv = e
      } else {
        if ( Bitcoin.Util.isArray( e ) ) {
          this.priv = BigInteger.fromByteArrayUnsigned( e )
        } else {
          if ( "string" == typeof e ) {
            if ( e.length == 51 && e[ 0 ] == "5" ) {
              this.priv = BigInteger.fromByteArrayUnsigned( b.decodeString( e ) )
            } else {
              this.priv = BigInteger.fromByteArrayUnsigned( Crypto.util.base64ToBytes( e ) )
            }
          }
        }
      }
    }
    this.compressed = !! b.compressByDefault
  };
  b.compressByDefault = false;
  b.prototype.setCompressed = function( e ) {
    this.compressed = !! e
  };
  b.prototype.isCompressed = function() {
    return this.compressed
  };
  b.prototype.getPub = function() {
    return this.getPubPoint().getEncoded( this.compressed )
  };
  b.prototype.getPubPoint = function() {
    if ( !this.pub ) {
      this.pub = d.getG().multiply( this.priv )
    }
    return this.pub
  };
  b.prototype.getPubKeyHash = function() {
    if ( this.pubKeyHash ) {
      return this.pubKeyHash
    }
    return this.pubKeyHash = Bitcoin.Util.sha256ripe160( this.getPub() )
  };
  b.prototype.getBitcoinAddress = function() {
    var e = this.getPubKeyHash();
    return new Bitcoin.Address( e )
  };
  b.prototype.getPubCompressed = function() {
    if ( this.pubCompressed ) {
      return this.pubCompressed
    }
    return this.pubCompressed = this.getPubPoint().getEncoded( 1 )
  };
  b.prototype.getPubKeyHashCompressed = function() {
    if ( this.pubKeyHashCompressed ) {
      return this.pubKeyHashCompressed
    }
    return this.pubKeyHashCompressed = Bitcoin.Util.sha256ripe160( this.getPubCompressed() )
  };
  b.prototype.getBitcoinAddressCompressed = function() {
    var e = this.getPubKeyHashCompressed();
    return new Bitcoin.Address( e )
  };
  b.prototype.setPub = function( e ) {
    this.pub = ECPointFp.decodeFrom( d.getCurve(), e )
  };
  b.prototype.toString = function( e ) {
    if ( e === "base64" ) {
      return Crypto.util.bytesToBase64( this.priv.toByteArrayUnsigned() )
    } else {
      return Crypto.util.bytesToHex( this.priv.toByteArrayUnsigned() )
    }
  };
  b.prototype.sign = function( e ) {
    return c.sign( e, this.priv )
  };
  b.prototype.verify = function( e, f ) {
    return c.verify( e, f, this.getPub() )
  };
  return b
} )();
var Opcode = Bitcoin.Opcode = function( a ) {
  this.code = a
};
Opcode.prototype.toString = function() {
  return Opcode.reverseMap[ this.code ]
};
Opcode.map = {
  OP_0: 0,
  OP_FALSE: 0,
  OP_PUSHDATA1: 76,
  OP_PUSHDATA2: 77,
  OP_PUSHDATA4: 78,
  OP_1NEGATE: 79,
  OP_RESERVED: 80,
  OP_1: 81,
  OP_TRUE: 81,
  OP_2: 82,
  OP_3: 83,
  OP_4: 84,
  OP_5: 85,
  OP_6: 86,
  OP_7: 87,
  OP_8: 88,
  OP_9: 89,
  OP_10: 90,
  OP_11: 91,
  OP_12: 92,
  OP_13: 93,
  OP_14: 94,
  OP_15: 95,
  OP_16: 96,
  OP_NOP: 97,
  OP_VER: 98,
  OP_IF: 99,
  OP_NOTIF: 100,
  OP_VERIF: 101,
  OP_VERNOTIF: 102,
  OP_ELSE: 103,
  OP_ENDIF: 104,
  OP_VERIFY: 105,
  OP_RETURN: 106,
  OP_TOALTSTACK: 107,
  OP_FROMALTSTACK: 108,
  OP_2DROP: 109,
  OP_2DUP: 110,
  OP_3DUP: 111,
  OP_2OVER: 112,
  OP_2ROT: 113,
  OP_2SWAP: 114,
  OP_IFDUP: 115,
  OP_DEPTH: 116,
  OP_DROP: 117,
  OP_DUP: 118,
  OP_NIP: 119,
  OP_OVER: 120,
  OP_PICK: 121,
  OP_ROLL: 122,
  OP_ROT: 123,
  OP_SWAP: 124,
  OP_TUCK: 125,
  OP_CAT: 126,
  OP_SUBSTR: 127,
  OP_LEFT: 128,
  OP_RIGHT: 129,
  OP_SIZE: 130,
  OP_INVERT: 131,
  OP_AND: 132,
  OP_OR: 133,
  OP_XOR: 134,
  OP_EQUAL: 135,
  OP_EQUALVERIFY: 136,
  OP_RESERVED1: 137,
  OP_RESERVED2: 138,
  OP_1ADD: 139,
  OP_1SUB: 140,
  OP_2MUL: 141,
  OP_2DIV: 142,
  OP_NEGATE: 143,
  OP_ABS: 144,
  OP_NOT: 145,
  OP_0NOTEQUAL: 146,
  OP_ADD: 147,
  OP_SUB: 148,
  OP_MUL: 149,
  OP_DIV: 150,
  OP_MOD: 151,
  OP_LSHIFT: 152,
  OP_RSHIFT: 153,
  OP_BOOLAND: 154,
  OP_BOOLOR: 155,
  OP_NUMEQUAL: 156,
  OP_NUMEQUALVERIFY: 157,
  OP_NUMNOTEQUAL: 158,
  OP_LESSTHAN: 159,
  OP_GREATERTHAN: 160,
  OP_LESSTHANOREQUAL: 161,
  OP_GREATERTHANOREQUAL: 162,
  OP_MIN: 163,
  OP_MAX: 164,
  OP_WITHIN: 165,
  OP_RIPEMD160: 166,
  OP_SHA1: 167,
  OP_SHA256: 168,
  OP_HASH160: 169,
  OP_HASH256: 170,
  OP_CODESEPARATOR: 171,
  OP_CHECKSIG: 172,
  OP_CHECKSIGVERIFY: 173,
  OP_CHECKMULTISIG: 174,
  OP_CHECKMULTISIGVERIFY: 175,
  OP_NOP1: 176,
  OP_NOP2: 177,
  OP_NOP3: 178,
  OP_NOP4: 179,
  OP_NOP5: 180,
  OP_NOP6: 181,
  OP_NOP7: 182,
  OP_NOP8: 183,
  OP_NOP9: 184,
  OP_NOP10: 185,
  OP_PUBKEYHASH: 253,
  OP_PUBKEY: 254,
  OP_INVALIDOPCODE: 255
};
Opcode.reverseMap = [];
for ( var i in Opcode.map ) {
  Opcode.reverseMap[ Opcode.map[ i ] ] = i
}
Bitcoin.ECKey = ( function() {
  var c = Bitcoin.ECDSA;
  var d = secp256k1();
  var a = new SecureRandom();
  var b = function( e ) {
    if ( !e ) {
      var f = d.getN();
      this.priv = c.getBigRandom( f )
    } else {
      if ( e instanceof BigInteger ) {
        this.priv = e
      } else {
        if ( Bitcoin.Util.isArray( e ) ) {
          this.priv = BigInteger.fromByteArrayUnsigned( e )
        } else {
          if ( "string" == typeof e ) {
            if ( e.length == 51 && e[ 0 ] == "5" ) {
              this.priv = BigInteger.fromByteArrayUnsigned( b.decodeString( e ) )
            } else {
              this.priv = BigInteger.fromByteArrayUnsigned( Crypto.util.base64ToBytes( e ) )
            }
          }
        }
      }
    }
    this.compressed = !! b.compressByDefault
  };
  b.compressByDefault = false;
  b.prototype.setCompressed = function( e ) {
    this.compressed = !! e
  };
  b.prototype.isCompressed = function() {
    return this.compressed
  };
  b.prototype.getPub = function() {
    return this.getPubPoint().getEncoded( this.compressed )
  };
  b.prototype.getPubPoint = function() {
    if ( !this.pub ) {
      this.pub = d.getG().multiply( this.priv )
    }
    return this.pub
  };
  b.prototype.getPubKeyHash = function() {
    if ( this.pubKeyHash ) {
      return this.pubKeyHash
    }
    return this.pubKeyHash = Bitcoin.Util.sha256ripe160( this.getPub() )
  };
  b.prototype.getBitcoinAddress = function() {
    var e = this.getPubKeyHash();
    return new Bitcoin.Address( e )
  };
  b.prototype.getPubCompressed = function() {
    if ( this.pubCompressed ) {
      return this.pubCompressed
    }
    return this.pubCompressed = this.getPubPoint().getEncoded( 1 )
  };
  b.prototype.getPubKeyHashCompressed = function() {
    if ( this.pubKeyHashCompressed ) {
      return this.pubKeyHashCompressed
    }
    return this.pubKeyHashCompressed = Bitcoin.Util.sha256ripe160( this.getPubCompressed() )
  };
  b.prototype.getBitcoinAddressCompressed = function() {
    var e = this.getPubKeyHashCompressed();
    return new Bitcoin.Address( e )
  };
  b.prototype.setPub = function( e ) {
    this.pub = ECPointFp.decodeFrom( d.getCurve(), e )
  };
  b.prototype.toString = function( e ) {
    if ( e === "base64" ) {
      return Crypto.util.bytesToBase64( this.priv.toByteArrayUnsigned() )
    } else {
      return Crypto.util.bytesToHex( this.priv.toByteArrayUnsigned() )
    }
  };
  b.prototype.sign = function( e ) {
    return c.sign( e, this.priv )
  };
  b.prototype.verify = function( e, f ) {
    return c.verify( e, f, this.getPub() )
  };
  return b
} )();
var Script = Bitcoin.Script = function( a ) {
  if ( !a ) {
    this.buffer = []
  } else {
    if ( "string" == typeof a ) {
      this.buffer = Crypto.util.base64ToBytes( a )
    } else {
      if ( Bitcoin.Util.isArray( a ) ) {
        this.buffer = a
      } else {
        if ( a.buffer ) {
          this.buffer = a.buffer
        } else {
          throw new Error( "Invalid script" )
        }
      }
    }
  }
  this.parse()
};
Script.prototype.parse = function() {
  var b = this;
  this.chunks = [];
  var d = 0;

  function c( f ) {
    b.chunks.push( b.buffer.slice( d, d + f ) );
    d += f
  }
  while ( d < this.buffer.length ) {
    var e = this.buffer[ d++ ];
    if ( e >= 240 ) {
      e = ( e << 8 ) | this.buffer[ d++ ]
    }
    var a;
    if ( e > 0 && e < Opcode.map.OP_PUSHDATA1 ) {
      c( e )
    } else {
      if ( e == Opcode.map.OP_PUSHDATA1 ) {
        a = this.buffer[ d++ ];
        c( a )
      } else {
        if ( e == Opcode.map.OP_PUSHDATA2 ) {
          a = ( this.buffer[ d++ ] << 8 ) | this.buffer[ d++ ];
          c( a )
        } else {
          if ( e == Opcode.map.OP_PUSHDATA4 ) {
            a = ( this.buffer[ d++ ] << 24 ) | ( this.buffer[ d++ ] << 16 ) | ( this.buffer[ d++ ] << 8 ) | this.buffer[ d++ ];
            c( a )
          } else {
            this.chunks.push( e )
          }
        }
      }
    }
  }
};
Script.prototype.getOutType = function() {
  if ( this.chunks.length == 5 && this.chunks[ 0 ] == Opcode.map.OP_DUP && this.chunks[ 1 ] == Opcode.map.OP_HASH160 && this.chunks[ 3 ] == Opcode.map.OP_EQUALVERIFY && this.chunks[ 4 ] == Opcode.map.OP_CHECKSIG ) {
    return "Address"
  } else {
    if ( this.chunks.length == 2 && this.chunks[ 1 ] == Opcode.map.OP_CHECKSIG ) {
      return "Pubkey"
    } else {
      if ( this.chunks[ this.chunks.length - 1 ] == Opcode.map.OP_CHECKMULTISIG && this.chunks[ this.chunks.length - 2 ] <= 3 ) {
        return "Multisig"
      } else {
        return "Strange"
      }
    }
  }
};
Script.prototype.simpleOutHash = function() {
  switch ( this.getOutType() ) {
    case "Address":
      return this.chunks[ 2 ];
    case "Pubkey":
      return Bitcoin.Util.sha256ripe160( this.chunks[ 0 ] );
    default:
      throw new Error( "Encountered non-standard scriptPubKey " + this.getOutType() + " Hex: " + Bitcoin.Util.bytesToHex( this.buffer ) )
  }
};
Script.prototype.simpleOutPubKeyHash = Script.prototype.simpleOutHash;
Script.prototype.getInType = function() {
  if ( this.chunks.length == 1 && Bitcoin.Util.isArray( this.chunks[ 0 ] ) ) {
    return "Pubkey"
  } else {
    if ( this.chunks.length == 2 && Bitcoin.Util.isArray( this.chunks[ 0 ] ) && Bitcoin.Util.isArray( this.chunks[ 1 ] ) ) {
      return "Address"
    } else {
      return "Strange"
    }
  }
};
Script.prototype.simpleInPubKey = function() {
  switch ( this.getInType() ) {
    case "Address":
      return this.chunks[ 1 ];
    case "Pubkey":
      throw new Error( "Script does not contain pubkey." );
    default:
      throw new Error( "Encountered non-standard scriptSig" )
  }
};
Script.prototype.simpleInHash = function() {
  return Bitcoin.Util.sha256ripe160( this.simpleInPubKey() )
};
Script.prototype.simpleInPubKeyHash = Script.prototype.simpleInHash;
Script.prototype.writeOp = function( a ) {
  this.buffer.push( a );
  this.chunks.push( a )
};
Script.prototype.writeBytes = function( a ) {
  if ( a.length < Opcode.map.OP_PUSHDATA1 ) {
    this.buffer.push( a.length )
  } else {
    if ( a.length <= 255 ) {
      this.buffer.push( Opcode.map.OP_PUSHDATA1 );
      this.buffer.push( a.length )
    } else {
      if ( a.length <= 65535 ) {
        this.buffer.push( Opcode.map.OP_PUSHDATA2 );
        this.buffer.push( a.length & 255 );
        this.buffer.push( ( a.length >>> 8 ) & 255 )
      } else {
        this.buffer.push( Opcode.map.OP_PUSHDATA4 );
        this.buffer.push( a.length & 255 );
        this.buffer.push( ( a.length >>> 8 ) & 255 );
        this.buffer.push( ( a.length >>> 16 ) & 255 );
        this.buffer.push( ( a.length >>> 24 ) & 255 )
      }
    }
  }
  this.buffer = this.buffer.concat( a );
  this.chunks.push( a )
};
Script.createOutputScript = function( a ) {
  var b = new Script();
  b.writeOp( Opcode.map.OP_DUP );
  b.writeOp( Opcode.map.OP_HASH160 );
  b.writeBytes( a.hash );
  b.writeOp( Opcode.map.OP_EQUALVERIFY );
  b.writeOp( Opcode.map.OP_CHECKSIG );
  return b
};
Script.prototype.extractAddresses = function( b ) {
  switch ( this.getOutType() ) {
    case "Address":
      b.push( new Bitcoin.Address( this.chunks[ 2 ] ) );
      return 1;
    case "Pubkey":
      b.push( new Bitcoin.Address( Bitcoin.Util.sha256ripe160( this.chunks[ 0 ] ) ) );
      return 1;
    case "Multisig":
      for ( var a = 1; a < this.chunks.length - 2; ++a ) {
        b.push( new Bitcoin.Address( Bitcoin.Util.sha256ripe160( this.chunks[ a ] ) ) )
      }
      return this.chunks[ 0 ] - Opcode.map.OP_1 + 1;
    default:
      throw new Error( "ExtractAddresses Encountered non-standard scriptPubKey " + this.getOutType() + " Hex: " + Bitcoin.Util.bytesToHex( this.serialize() ) )
  }
};
Script.createMultiSigOutputScript = function( a, c ) {
  var b = new Bitcoin.Script();
  b.writeOp( Opcode.map.OP_1 + a - 1 );
  for ( var d = 0; d < c.length; ++d ) {
    b.writeBytes( c[ d ] )
  }
  b.writeOp( Opcode.map.OP_1 + c.length - 1 );
  b.writeOp( Opcode.map.OP_CHECKMULTISIG );
  return b
};
Script.createPubKeyScript = function( b ) {
  var a = new Bitcoin.Script();
  a.writeBytes( b );
  a.writeOp( Opcode.map.OP_CHECKSIG );
  return a
};
Script.createInputScript = function( b, a ) {
  var c = new Script();
  c.writeBytes( b );
  c.writeBytes( a );
  return c
};
Script.prototype.clone = function() {
  return new Script( this.buffer )
};
var OP_CODESEPARATOR = 171;
var SIGHASH_ALL = 1;
var SIGHASH_NONE = 2;
var SIGHASH_SINGLE = 3;
var SIGHASH_ANYONECANPAY = 80;
( function() {
  var a = Bitcoin.Script;
  var b = Bitcoin.Transaction = function( f ) {
    this.version = 1;
    this.lock_time = 0;
    this.ins = [];
    this.outs = [];
    this.timestamp = null;
    this.block = null;
    if ( f ) {
      if ( f.hash ) {
        this.hash = f.hash
      }
      if ( f.version ) {
        this.version = f.version
      }
      if ( f.lock_time ) {
        this.lock_time = f.lock_time
      }
      if ( f.ins && f.ins.length ) {
        for ( var e = 0; e < f.ins.length; e++ ) {
          this.addInput( new c( f.ins[ e ] ) )
        }
      }
      if ( f.outs && f.outs.length ) {
        for ( var e = 0; e < f.outs.length; e++ ) {
          this.addOutput( new d( f.outs[ e ] ) )
        }
      }
      if ( f.timestamp ) {
        this.timestamp = f.timestamp
      }
      if ( f.block ) {
        this.block = f.block
      }
    }
  };
  b.objectify = function( e ) {
    var g = [];
    for ( var f = 0; f < e.length; f++ ) {
      g.push( new b( e[ f ] ) )
    }
    return g
  };
  b.prototype.addInput = function( e, f ) {
    if ( arguments[ 0 ] instanceof c ) {
      this.ins.push( arguments[ 0 ] )
    } else {
      this.ins.push( new c( {
        outpoint: {
          hash: e.hash,
          index: f
        },
        script: new Bitcoin.Script(),
        sequence: 4294967295
      } ) )
    }
  };
  b.prototype.addOutput = function( e, f ) {
    if ( arguments[ 0 ] instanceof d ) {
      this.outs.push( arguments[ 0 ] )
    } else {
      if ( f instanceof BigInteger ) {
        f = f.toByteArrayUnsigned().reverse();
        while ( f.length < 8 ) {
          f.push( 0 )
        }
      } else {
        if ( Bitcoin.Util.isArray( f ) ) {}
      }
      this.outs.push( new d( {
        value: f,
        script: a.createOutputScript( e )
      } ) )
    }
  };
  b.prototype.serialize = function() {
    var e = [];
    e = e.concat( Crypto.util.wordsToBytes( [ parseInt( this.version ) ] ).reverse() );
    e = e.concat( Bitcoin.Util.numToVarInt( this.ins.length ) );
    for ( var f = 0; f < this.ins.length; f++ ) {
      var h = this.ins[ f ];
      e = e.concat( Crypto.util.base64ToBytes( h.outpoint.hash ) );
      e = e.concat( Crypto.util.wordsToBytes( [ parseInt( h.outpoint.index ) ] ).reverse() );
      var g = h.script.buffer;
      e = e.concat( Bitcoin.Util.numToVarInt( g.length ) );
      e = e.concat( g );
      e = e.concat( Crypto.util.wordsToBytes( [ parseInt( h.sequence ) ] ).reverse() )
    }
    e = e.concat( Bitcoin.Util.numToVarInt( this.outs.length ) );
    for ( var f = 0; f < this.outs.length; f++ ) {
      var j = this.outs[ f ];
      e = e.concat( j.value );
      var g = j.script.buffer;
      e = e.concat( Bitcoin.Util.numToVarInt( g.length ) );
      e = e.concat( g )
    }
    e = e.concat( Crypto.util.wordsToBytes( [ parseInt( this.lock_time ) ] ).reverse() );
    return e
  };
  b.prototype.hashTransactionForSignature = function( h, l, f ) {
    var j = this.clone();
    for ( var g = 0; g < j.ins.length; g++ ) {
      j.ins[ g ].script = new a()
    }
    j.ins[ l ].script = h;
    if ( ( f & 31 ) == SIGHASH_NONE ) {
      j.outs = [];
      for ( var g = 0; g < j.ins.length; g++ ) {
        if ( g != l ) {
          j.ins[ g ].sequence = 0
        }
      }
    } else {
      if ( ( f & 31 ) == SIGHASH_SINGLE ) {}
    } if ( f & SIGHASH_ANYONECANPAY ) {
      j.ins = [ j.ins[ l ] ]
    }
    var e = j.serialize();
    e = e.concat( Crypto.util.wordsToBytes( [ parseInt( f ) ] ).reverse() );
    var k = Crypto.SHA256( e, {
      asBytes: true
    } );
    return Crypto.SHA256( k, {
      asBytes: true
    } )
  };
  b.prototype.getHash = function() {
    var e = this.serialize();
    return Crypto.SHA256( Crypto.SHA256( e, {
      asBytes: true
    } ), {
      asBytes: true
    } )
  };
  b.prototype.clone = function() {
    var f = new b();
    f.version = this.version;
    f.lock_time = this.lock_time;
    for ( var e = 0; e < this.ins.length; e++ ) {
      var g = this.ins[ e ].clone();
      f.addInput( g )
    }
    for ( var e = 0; e < this.outs.length; e++ ) {
      var h = this.outs[ e ].clone();
      f.addOutput( h )
    }
    return f
  };
  b.prototype.addOutputScript = function( e, f ) {
    if ( arguments[ 0 ] instanceof d ) {
      this.outs.push( arguments[ 0 ] )
    } else {
      if ( f instanceof BigInteger ) {
        f = f.toByteArrayUnsigned().reverse();
        while ( f.length < 8 ) {
          f.push( 0 )
        }
      } else {
        if ( Bitcoin.Util.isArray( f ) ) {}
      }
      this.outs.push( new d( {
        value: f,
        script: e
      } ) )
    }
  };
  b.prototype.analyze = function( f ) {
    if ( !( f instanceof Bitcoin.Wallet ) ) {
      return null
    }
    var g = true,
      j = true,
      p = null,
      h = null,
      l = null;
    for ( var m = this.outs.length - 1; m >= 0; m-- ) {
      var q = this.outs[ m ];
      var k = q.script.simpleOutPubKeyHash();
      if ( !f.hasHash( k ) ) {
        j = false
      } else {
        h = k
      }
      p = k
    }
    for ( var m = this.ins.length - 1; m >= 0; m-- ) {
      var o = this.ins[ m ];
      l = o.script.simpleInPubKeyHash();
      if ( !f.hasHash( l ) ) {
        g = false;
        break
      }
    }
    var e = this.calcImpact( f );
    var n = {};
    n.impact = e;
    if ( e.sign > 0 && e.value.compareTo( BigInteger.ZERO ) > 0 ) {
      n.type = "recv";
      n.addr = new Bitcoin.Address( h )
    } else {
      if ( g && j ) {
        n.type = "self"
      } else {
        if ( g ) {
          n.type = "sent";
          n.addr = new Bitcoin.Address( p )
        } else {
          n.type = "other"
        }
      }
    }
    return n
  };
  b.prototype.getDescription = function( e ) {
    var f = this.analyze( e );
    if ( !f ) {
      return ""
    }
    switch ( f.type ) {
      case "recv":
        return "Received with " + f.addr;
        break;
      case "sent":
        return "Payment to " + f.addr;
        break;
      case "self":
        return "Payment to yourself";
        break;
      case "other":
      default:
        return ""
    }
  };
  b.prototype.getTotalOutValue = function() {
    var e = BigInteger.ZERO;
    for ( var f = 0; f < this.outs.length; f++ ) {
      var g = this.outs[ f ];
      e = e.add( Bitcoin.Util.valueToBigInt( g.value ) )
    }
    return e
  };
  b.prototype.getTotalValue = b.prototype.getTotalOutValue;
  b.prototype.calcImpact = function( g ) {
    if ( !( g instanceof Bitcoin.Wallet ) ) {
      return BigInteger.ZERO
    }
    var k = BigInteger.ZERO;
    for ( var f = 0; f < this.outs.length; f++ ) {
      var n = this.outs[ f ];
      var m = Crypto.util.bytesToBase64( n.script.simpleOutPubKeyHash() );
      if ( g.hasHash( m ) ) {
        k = k.add( Bitcoin.Util.valueToBigInt( n.value ) )
      }
    }
    var e = BigInteger.ZERO;
    for ( var f = 0; f < this.ins.length; f++ ) {
      var l = this.ins[ f ];
      var m = Crypto.util.bytesToBase64( l.script.simpleInPubKeyHash() );
      if ( g.hasHash( m ) ) {
        var h = g.txIndex[ l.outpoint.hash ];
        if ( h ) {
          e = e.add( Bitcoin.Util.valueToBigInt( h.outs[ l.outpoint.index ].value ) )
        }
      }
    }
    if ( k.compareTo( e ) >= 0 ) {
      return {
        sign: 1,
        value: k.subtract( e )
      }
    } else {
      return {
        sign: -1,
        value: e.subtract( k )
      }
    }
  };
  var c = Bitcoin.TransactionIn = function( e ) {
    this.outpoint = e.outpoint;
    if ( e.script instanceof a ) {
      this.script = e.script
    } else {
      this.script = new a( e.script )
    }
    this.sequence = e.sequence
  };
  c.prototype.clone = function() {
    var e = new c( {
      outpoint: {
        hash: this.outpoint.hash,
        index: this.outpoint.index
      },
      script: this.script.clone(),
      sequence: this.sequence
    } );
    return e
  };
  var d = Bitcoin.TransactionOut = function( e ) {
    if ( e.script instanceof a ) {
      this.script = e.script
    } else {
      this.script = new a( e.script )
    } if ( Bitcoin.Util.isArray( e.value ) ) {
      this.value = e.value
    } else {
      if ( "string" == typeof e.value ) {
        var f = ( new BigInteger( e.value, 10 ) ).toString( 16 );
        while ( f.length < 16 ) {
          f = "0" + f
        }
        this.value = Crypto.util.hexToBytes( f )
      }
    }
  };
  d.prototype.clone = function() {
    var e = new d( {
      script: this.script.clone(),
      value: this.value.slice( 0 )
    } );
    return e
  }
} )();
Bitcoin.Message = ( function() {
  var a = {};
  a.magicPrefix = "Bitcoin Signed Message:\n";
  a.makeMagicMessage = function( e ) {
    var c = Crypto.charenc.UTF8.stringToBytes( a.magicPrefix );
    var d = Crypto.charenc.UTF8.stringToBytes( e );
    var b = [];
    b = b.concat( Bitcoin.Util.numToVarInt( c.length ) );
    b = b.concat( c );
    b = b.concat( Bitcoin.Util.numToVarInt( d.length ) );
    b = b.concat( d );
    return b
  };
  a.getHash = function( c ) {
    var b = a.makeMagicMessage( c );
    return Crypto.SHA256( Crypto.SHA256( b, {
      asBytes: true
    } ), {
      asBytes: true
    } )
  };
  a.signMessage = function( j, m, k ) {
    var b = a.getHash( m );
    var c = j.sign( b );
    var h = j.getBitcoinAddress().toString();
    var e = !( h == k );
    var d = Bitcoin.ECDSA.calcPubkeyRecoveryParam( h, c.r, c.s, b );
    d += 27;
    if ( e ) {
      d += 4
    }
    var f = c.r.toByteArrayUnsigned();
    var g = c.s.toByteArrayUnsigned();
    while ( f.length < 32 ) {
      f.unshift( 0 )
    }
    while ( g.length < 32 ) {
      g.unshift( 0 )
    }
    var l = [ d ].concat( f ).concat( g );
    return Crypto.util.bytesToBase64( l )
  };
  a.verifyMessage = function( d, g, e ) {
    g = Crypto.util.base64ToBytes( g );
    g = Bitcoin.ECDSA.parseSigCompact( g );
    var f = a.getHash( e );
    var c = !! ( g.i & 4 );
    var b = Bitcoin.ECDSA.recoverPubKey( g.r, g.s, f, g.i );
    b.setCompressed( c );
    if ( b.getBitcoinAddress().toString() == d || b.getBitcoinAddressCompressed().toString() == d ) {
      return true
    } else {
      return false
    }
  };
  return a
} )();
