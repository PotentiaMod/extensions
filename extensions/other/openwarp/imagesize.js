// Name: 获取图片长、宽
// ID: imagesize
// Description: 获取图片的长、宽
// By: Yesshape <https://scratch.mit.edu/users/yesshape/>
class ImageSize {
  getInfo() {
    return {
      id: 'imagesize',
      name: '图片尺寸',
      color1: '#4C97FF',
      color2: '#3373CC',
      blocks: [
        {
          opcode: 'getWidth',
          blockType: Scratch.BlockType.REPORTER,
          text: '图片 [URL] 的宽度',
          arguments: {
            URL: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'https://example.com/image.png'
            }
          }
        },
        {
          opcode: 'getHeight',
          blockType: Scratch.BlockType.REPORTER,
          text: '图片 [URL] 的高度',
          arguments: {
            URL: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'https://example.com/image.png'
            }
          }
        },
        {
          opcode: 'getCostumeWidth',
          blockType: Scratch.BlockType.REPORTER,
          text: '造型 [COSTUME] 的宽度',
          arguments: {
            COSTUME: {
              type: Scratch.ArgumentType.COSTUME,
              defaultValue: ''
            }
          }
        },
        {
          opcode: 'getCostumeHeight',
          blockType: Scratch.BlockType.REPORTER,
          text: '造型 [COSTUME] 的高度',
          arguments: {
            COSTUME: {
              type: Scratch.ArgumentType.COSTUME,
              defaultValue: ''
            }
          }
        }
      ]
    };
  }

  getWidth(args) {
    return this._loadImage(args.URL).then(img => img.width);
  }

  getHeight(args) {
    return this._loadImage(args.URL).then(img => img.height);
  }

  async getCostumeWidth(args, util) {
    const size = await this._getCostumeSize(args.COSTUME, util);
    return size.width;
  }

  async getCostumeHeight(args, util) {
    const size = await this._getCostumeSize(args.COSTUME, util);
    return size.height;
  }

  _loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = (err) => reject(new Error('无法加载图片：' + url));
      img.src = url;
    });
  }

  async _getCostumeSize(costumeName, util) {
    const target = util.target;
    console.log('=== 造型尺寸获取开始 ===');
    console.log('目标名称:', target.getName());
    console.log('是否舞台:', target.isStage);
    console.log('查找造型名:', costumeName);

    // 获取造型列表
    const costumes = this._getCostumeList(target);
    console.log('造型列表:', costumes.map(c => ({ name: c.name, id: c.id })));

    // 查找造型
    let costume = costumes.find(c => c.name === costumeName);
    if (!costume && costumes.length > 0) {
      console.warn('找不到指定造型，使用第一个');
      costume = costumes[0];
    }
    if (!costume) {
      throw new Error('没有任何造型可用');
    }
    console.log('使用造型:', costume.name);

    // 方案1: 使用 getBitmapSize
    if (typeof costume.getBitmapSize === 'function') {
      try {
        console.log('尝试 getBitmapSize...');
        const size = await costume.getBitmapSize(util.runtime);
        console.log('getBitmapSize 结果:', size);
        if (size && size.width && size.height) {
          return { width: size.width, height: size.height };
        }
      } catch (e) {
        console.warn('getBitmapSize 失败:', e);
      }
    }

    // 方案2: 直接检查 costume 对象上的尺寸属性
    if (costume.width && costume.height) {
      console.log('使用 costume 对象上的宽高属性:', costume.width, costume.height);
      return { width: costume.width, height: costume.height };
    }

    // 方案3: 通过 storage 加载资产数据
    try {
      console.log('尝试通过 storage 加载资产...');
      const asset = costume.asset || costume;
      console.log('资产信息:', { 
        assetType: asset.assetType, 
        assetId: asset.assetId, 
        dataFormat: asset.dataFormat 
      });

      // 获取资产 URL
      const assetUrl = await this._getAssetUrl(asset, util.runtime);
      console.log('资产 URL:', assetUrl);

      if (assetUrl) {
        // SVG 特殊处理
        if (asset.dataFormat === 'svg') {
          console.log('处理 SVG...');
          try {
            const response = await fetch(assetUrl);
            const svgText = await response.text();
            console.log('SVG 文本长度:', svgText.length);
            const size = this._parseSvgSize(svgText);
            console.log('SVG 解析尺寸:', size);
            if (size.width && size.height) {
              return size;
            }
          } catch (e) {
            console.warn('SVG 处理失败:', e);
          }
        }

        // 位图使用 Image
        console.log('使用 Image 加载...');
        const size = await this._loadImage(assetUrl);
        console.log('Image 加载成功:', size);
        return size;
      }
    } catch (e) {
      console.error('资产加载失败:', e);
    }

    // 方案4: 尝试获取 costume 的 data URL
    try {
      console.log('尝试获取 data URL...');
      const dataUrl = this._getCostumeDataUrl(costume, util.runtime);
      if (dataUrl) {
        console.log('使用 data URL 加载');
        const size = await this._loadImage(dataUrl);
        return size;
      }
    } catch (e) {
      console.warn('data URL 获取失败:', e);
    }

    throw new Error('所有获取造型尺寸的方法都失败了');
  }

  _getCostumeList(target) {
    if (target.isStage) {
      return target.costumes || [];
    }
    
    // 尝试多种获取方式
    if (typeof target.getCostumes === 'function') {
      return target.getCostumes();
    }
    if (target.sprite && target.sprite.costumes) {
      return target.sprite.costumes;
    }
    if (target.costumes) {
      return target.costumes;
    }
    return [];
  }

  async _getAssetUrl(asset, runtime) {
    // 如果 asset 有 encodeDataURI 方法
    if (typeof asset.encodeDataURI === 'function') {
      try {
        const dataUri = asset.encodeDataURI();
        return dataUri;
      } catch (e) {
        console.warn('encodeDataURI 失败:', e);
      }
    }

    // 通过 storage 获取
    if (runtime && runtime.storage) {
      try {
        const storage = runtime.storage;
        const loaded = await storage.load(asset.assetType, asset.assetId, asset.dataFormat);
        
        if (loaded) {
          let data = loaded.data;
          
          // 转换为 Blob URL
          const mime = asset.dataFormat === 'svg' ? 'image/svg+xml' : 'image/png';
          if (typeof data === 'string') {
            // 如果是 data URL 直接返回
            if (data.startsWith('data:')) {
              return data;
            }
            // 如果是 SVG 文本
            if (asset.dataFormat === 'svg') {
              const blob = new Blob([data], { type: mime });
              return URL.createObjectURL(blob);
            }
          }
          
          if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
            const blob = new Blob([data], { type: mime });
            return URL.createObjectURL(blob);
          }

          // 生成 data URL
          const blob = new Blob([data], { type: mime });
          return URL.createObjectURL(blob);
        }
      } catch (e) {
        console.warn('storage.load 失败:', e);
      }
    }

    return null;
  }

  _getCostumeDataUrl(costume, runtime) {
    // 直接访问可能的属性
    if (costume.dataUrl) return costume.dataUrl;
    if (costume.asset && costume.asset.dataUrl) return costume.asset.dataUrl;
    if (costume.asset && costume.asset.data) {
      if (typeof costume.asset.data === 'string' && costume.asset.data.startsWith('data:')) {
        return costume.asset.data;
      }
    }
    return null;
  }

  _parseSvgSize(svgText) {
    let width = 480;
    let height = 360;

    // 尝试解析 viewBox
    const viewBoxMatch = svgText.match(/viewBox\s*=\s*["']?[\d.]+\s+[\d.]+\s+([\d.]+)\s+([\d.]+)/);
    if (viewBoxMatch) {
      width = parseFloat(viewBoxMatch[1]);
      height = parseFloat(viewBoxMatch[2]);
    }

    // 尝试解析 width/height 属性
    const widthMatch = svgText.match(/width\s*=\s*["']([\d.]+)/);
    const heightMatch = svgText.match(/height\s*=\s*["']([\d.]+)/);
    
    if (widthMatch) width = parseFloat(widthMatch[1]);
    if (heightMatch) height = parseFloat(heightMatch[1]);

    return { width, height };
  }
}

Scratch.extensions.register(new ImageSize());