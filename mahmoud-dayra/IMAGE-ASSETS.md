# تجهيز أصول الصور

استُخدمت أداة ImageGen المدمجة لتحويل الصورة الشخصية واللوجو المرفقين إلى PNG بخلفية شفافة. المخرجات داخل المشروع: assets/portrait.png وassets/logo.png. أُبقيت الملفات الأصلية في مجلد Downloads دون تغيير.

## نص توجيه الصورة الشخصية
Edit target: the supplied portrait photo. Remove ONLY the white wall/background and the background watermark. Produce a clean transparent PNG cutout of this exact man, retaining his exact facial identity, expression, bald head, beard, pose, black t-shirt, jeans, wristwatch, proportions, original skin texture and original photo pixels as closely as possible. Do not beautify, redraw, relight or change any features, clothes or pose. No new background, no shadows, no graphic additions. Crop empty space above the head while preserving all parts of the person visible in the source. This is a background-removal asset for his professional portfolio.

## نص توجيه اللوجو
Use case: background-extraction. Edit target: supplied black logo on white background. Remove ONLY the white background, including all white gaps inside the mark, producing a genuinely transparent PNG. Preserve the exact original black silhouette, geometry, curves, proportions, relative positions of all strokes and solid near-black fill. Do not redesign or reinterpret this existing brand mark. No text, lighting, shadows, texture, 3D or new shapes. Center the complete original mark with a modest transparent margin. Asset for the owner's portfolio website.

تم التأكد من وجود قناة شفافية حقيقية ومراجعة الناتجين بصريًا. تلوين اللوجو بالأبيض في الوضع الداكن يتم بالتنسيق داخل المتصفح. الكرات والمدارات والمسار والأيقونات عناصر CSS/SVG؛ لا تحتوي على أرقام أداء وهمية.
