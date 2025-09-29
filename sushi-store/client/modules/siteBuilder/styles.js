// Shared style helpers for the site builder previews
(function(){
      function heroImageProps(element) {
        const data = element.data || {};
        return {
          src: data.src || 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10',
          alt: data.alt || 'Изображение',
          style: {
            width: asCssSize(data.width, '320px'),
            height: data.height ? asCssSize(data.height, 'auto') : 'auto',
            borderRadius: asCssSize(data.borderRadius, '16px'),
            objectFit: data.objectFit || 'cover',
            boxShadow: data.boxShadow || '0 25px 60px rgba(15,23,42,0.35)',
            borderWidth: asCssSize(data.borderWidth, '0px'),
            borderStyle: 'solid',
            borderColor: data.borderColor || 'rgba(255,255,255,0.2)',
            backgroundColor: data.backgroundColor || 'transparent'
          }
        };
      }
      function sectionBackgroundStyle(data = {}, fallbackColor = '#ffffff') {
        const style = {
          backgroundColor: data.backgroundColor || fallbackColor,
          padding: `${asCssSize(data.sectionPaddingY, '64px')} ${asCssSize(data.sectionPaddingX, '40px')}`,
          position: 'relative'
        };
        const mode = data.backgroundMode || 'solid';
        if (mode === 'gradient' && data.backgroundGradient) {
          style.backgroundImage = data.backgroundGradient;
        } else if (mode === 'image' && data.backgroundImage) {
          style.backgroundImage = `url(${data.backgroundImage})`;
          style.backgroundSize = data.backgroundSize || 'cover';
          style.backgroundPosition = data.backgroundPosition || 'center center';
          style.backgroundRepeat = data.backgroundRepeat || 'no-repeat';
        } else {
          style.backgroundImage = 'none';
        }
        if (data.sectionBorderRadius) {
          style.borderRadius = asCssSize(data.sectionBorderRadius, data.sectionBorderRadius);
        }
        if (data.sectionShadow) {
          style.boxShadow = data.sectionShadow;
        }
        return style;
      }
      function sectionOverlayStyle(data = {}) {
        if (!data.overlayColor) {
          return null;
        }
        const style = {
          background: data.overlayColor,
          position: 'absolute',
          inset: '0',
          pointerEvents: 'none'
        };
        if (data.overlayBlur && data.overlayBlur !== '0' && data.overlayBlur !== '0px') {
          style.backdropFilter = `blur(${asCssSize(data.overlayBlur, data.overlayBlur)})`;
        }
        return style;
      }
      function blockButtonWrapperStyle(config = {}) {
        const align = config.buttonAlign || 'center';
        return { textAlign: align };
      }
      function blockButtonClass(config = {}) {
        const classes = ['inline-flex', 'items-center', 'justify-center', 'font-semibold', 'transition'];
        if ((config.buttonStyle || 'primary') !== 'link') {
          classes.push('px-6', 'py-3');
        }
        return classes.join(' ');
      }
      function blockButtonStyle(config = {}, defaults = {}) {
        const baseBackground = defaults.background || '#f97316';
        const style = {
          border: 'none',
          gap: '8px',
          borderRadius: asCssSize(config.buttonBorderRadius, defaults.borderRadius || '999px'),
          color: config.buttonTextColor || defaults.textColor || '#ffffff',
          background: config.buttonBackground || baseBackground,
          boxShadow: config.buttonShadow || defaults.shadow || 'none',
          padding: config.buttonStyle === 'link' ? '0' : (config.buttonPadding || '12px 28px')
        };
        if (config.buttonStyle === 'secondary') {
          style.background = config.buttonBackground || defaults.secondaryBackground || '#ffffff';
          style.color = config.buttonTextColor || defaults.secondaryText || '#111827';
        } else if (config.buttonStyle === 'outline') {
          const borderColor = config.buttonBackground || baseBackground;
          style.background = 'transparent';
          style.color = config.buttonTextColor || borderColor;
          style.border = `2px solid ${borderColor}`;
          style.boxShadow = config.buttonShadow || 'none';
        } else if (config.buttonStyle === 'link') {
          style.background = 'transparent';
          style.color = config.buttonTextColor || config.buttonBackground || baseBackground;
          style.boxShadow = 'none';
        }
        return style;
      }
      function categoriesSectionStyle(block) {
        return sectionBackgroundStyle(block?.data || {}, '#f9f4e5');
      }
      function categoriesOverlayStyle(block) {
        return sectionOverlayStyle(block?.data || {});
      }
      function categoriesHeaderStyle(block) {
        const data = block?.data || {};
        const textAlign = data.textAlign || 'center';
        return {
          textAlign,
          maxWidth: asCssSize(data.descriptionMaxWidth, '720px'),
          margin: textAlign === 'left' ? '0' : '0 auto'
        };
      }
      function categoriesHeadingStyle(block) {
        const data = block?.data || {};
        return {
          color: data.headingColor || '#111827',
          fontSize: data.headingFontSize || '40px',
          fontWeight: data.headingFontWeight || '700',
          fontFamily: data.headingFontFamily || 'inherit'
        };
      }
      function categoriesSubheadingStyle(block) {
        const data = block?.data || {};
        return {
          color: data.subheadingColor || '#f97316',
          fontSize: data.subheadingFontSize || '20px',
          fontWeight: data.subheadingFontWeight || '600'
        };
      }
      function categoriesDescriptionStyle(block) {
        const data = block?.data || {};
        return {
          color: data.descriptionColor || '#4b5563',
          fontSize: data.descriptionFontSize || '18px'
        };
      }
      function categoriesGridStyle(block) {
        const data = block?.data || {};
        const gap = asCssSize(data.cardGap, '24px');
        const minWidth = asCssSize(data.cardMinWidth, '240px');
        return {
          gap,
          gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}, 1fr))`
        };
      }
      function categoriesCardStyle(block) {
        const data = block?.data || {};
        return {
          background: data.cardBackground || '#ffffff',
          color: data.cardTextColor || '#1f2937',
          padding: data.cardPadding || '28px',
          borderRadius: asCssSize(data.cardBorderRadius, '24px'),
          boxShadow: data.cardShadow || '0 20px 45px rgba(15,23,42,0.08)',
          border: data.cardBorderColor ? `1px solid ${data.cardBorderColor}` : 'none',
          textAlign: 'center'
        };
      }
      function categoriesIconWrapperStyle(block) {
        const data = block?.data || {};
        const size = asCssSize(data.cardIconSize, '80px');
        let radius = '9999px';
        if (data.cardIconShape === 'rounded') {
          radius = '24px';
        } else if (data.cardIconShape === 'square') {
          radius = '12px';
        }
        return {
          width: size,
          height: size,
          margin: '0 auto',
          borderRadius: radius,
          background: data.cardIconBackground || 'rgba(249,115,22,0.12)',
          color: data.cardIconColor || '#f97316',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px'
        };
      }
      function categoriesCardTitleStyle(block) {
        return { color: block?.data?.cardTextColor || '#1f2937' };
      }
      function categoriesCardDescriptionStyle(block) {
        return { color: block?.data?.cardDescriptionColor || '#6b7280' };
      }
      function menuSectionStyle(block) {
        return sectionBackgroundStyle(block?.data || {}, '#fff7ed');
      }
      function menuOverlayStyle(block) {
        return sectionOverlayStyle(block?.data || {});
      }
      function menuHeaderStyle(block) {
        const data = block?.data || {};
        const textAlign = data.textAlign || 'center';
        return {
          textAlign,
          maxWidth: asCssSize(data.descriptionMaxWidth, '640px'),
          margin: textAlign === 'left' ? '0' : '0 auto'
        };
      }
      function menuHeadingStyle(block) {
        const data = block?.data || {};
        return {
          color: data.headingColor || '#111827',
          fontSize: data.headingFontSize || '36px',
          fontWeight: data.headingFontWeight || '700',
          fontFamily: data.headingFontFamily || 'inherit'
        };
      }
      function menuDescriptionStyle(block) {
        const data = block?.data || {};
        return {
          color: data.descriptionColor || '#4b5563',
          fontSize: data.descriptionFontSize || '18px'
        };
      }
      function menuFilterSurfaceStyle(block) {
        const data = block?.data || {};
        return {
          background: data.filtersBackground || 'rgba(255,255,255,0.7)',
          color: data.filtersTextColor || '#1f2937',
          boxShadow: data.filtersShadow || 'none',
          borderRadius: '16px',
          padding: '12px 20px'
        };
      }
      function menuTabsWrapperStyle(block) {
        const align = block?.data?.textAlign || 'center';
        let justify = 'center';
        if (align === 'left') justify = 'flex-start';
        if (align === 'right') justify = 'flex-end';
        return { justifyContent: justify };
      }
      function menuActiveTabStyle(block) {
        const data = block?.data || {};
        return {
          background: data.tagBackground || 'rgba(249,115,22,0.12)',
          color: data.tagTextColor || '#f97316'
        };
      }
      function menuTabStyle(block) {
        const data = block?.data || {};
        return {
          background: 'rgba(255,255,255,0.6)',
          color: (data.filtersTextColor || '#1f2937') + 'cc',
          border: '1px solid rgba(255,255,255,0.4)'
        };
      }
      function menuGridStyle(block) {
        const data = block?.data || {};
        const columns = clampNumber(Number(data.cardsPerRow) || 3, 1, 4);
        const minWidth = asCssSize(data.cardMinWidth, '260px');
        return {
          gap: '24px',
          gridTemplateColumns: `repeat(${columns}, minmax(${minWidth}, 1fr))`
        };
      }
      function menuCardStyle(block) {
        const data = block?.data || {};
        return {
          background: data.cardBackground || '#ffffff',
          color: data.cardTextColor || '#1f2937',
          padding: '20px',
          borderRadius: asCssSize(data.cardBorderRadius, '24px'),
          boxShadow: data.cardShadow || '0 18px 40px rgba(15,23,42,0.08)',
          border: data.cardBorderColor ? `1px solid ${data.cardBorderColor}` : 'none'
        };
      }
      function menuCardImageStyle(block) {
        const data = block?.data || {};
        return {
          height: asCssSize(data.cardImageHeight, '180px'),
          borderRadius: '18px',
          overflow: 'hidden',
          background: 'rgba(148,163,184,0.2)'
        };
      }
      function menuCardTitleStyle(block) {
        return { color: block?.data?.cardTextColor || '#1f2937' };
      }
      function menuCardDescriptionStyle(block) {
        return { color: block?.data?.cardDescriptionColor || '#6b7280' };
      }
      function menuPriceStyle(block) {
        return { color: block?.data?.priceColor || '#f97316', fontWeight: '600' };
      }
      function menuTagStyle(block) {
        const data = block?.data || {};
        return {
          background: data.tagBackground || 'rgba(249,115,22,0.12)',
          color: data.tagTextColor || '#f97316'
        };
      }
      function deliverySectionStyle(block) {
        return sectionBackgroundStyle(block?.data || {}, '#fff7ed');
      }
      function deliveryOverlayStyle(block) {
        return sectionOverlayStyle(block?.data || {});
      }
      function deliveryTextColumnStyle(block) {
        return { color: block?.data?.textColor || '#4b5563' };
      }
      function deliveryHeadingStyle(block) {
        const data = block?.data || {};
        return {
          color: data.headingColor || '#111827',
          fontSize: data.headingFontSize || '36px',
          fontWeight: data.headingFontWeight || '700',
          fontFamily: data.headingFontFamily || 'inherit'
        };
      }
      function deliveryDescriptionStyle(block) {
        return { color: block?.data?.textColor || '#4b5563' };
      }
      function deliveryFeatureIconStyle(block) {
        const data = block?.data || {};
        const bg = data.featureIconBackground || '#f97316';
        let radius = '9999px';
        if (data.featureIconShape === 'rounded') {
          radius = '18px';
        } else if (data.featureIconShape === 'square') {
          radius = '8px';
        }
        return {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '28px',
          height: '28px',
          borderRadius: radius,
          background: bg,
          color: data.featureIconColor || '#ffffff',
          fontSize: '12px'
        };
      }
      function deliveryFeatureTextStyle(block) {
        return { color: block?.data?.featureTextColor || '#1f2937', fontSize: '14px' };
      }
      function deliveryContactsStyle(block) {
        return { color: block?.data?.contactTextColor || '#4b5563' };
      }
      function deliveryTrackingCardStyle(block) {
        const data = block?.data || {};
        return {
          background: data.cardBackground || '#ffffff',
          borderRadius: asCssSize(data.cardBorderRadius, '24px'),
          boxShadow: data.cardShadow || '0 20px 50px rgba(15,23,42,0.1)',
          overflow: 'hidden'
        };
      }
      function deliveryTrackingBarStyle(block) {
        const data = block?.data || {};
        const base = data.featureIconBackground || '#f97316';
        return {
          height: '48px',
          background: `linear-gradient(90deg, ${base}, rgba(239,68,68,0.85))`
        };
      }
      function deliveryTrackingTitleStyle(block) {
        return { color: block?.data?.cardTextColor || '#1f2937' };
      }
      function deliveryTrackingDescriptionStyle(block) {
        return { color: block?.data?.contactTextColor || '#6b7280' };
      }
      function deliveryTrackingProgressStyle(block) {
        const data = block?.data || {};
        const percent = clampNumber(parseCssNumber(data.trackingProgress, 75), 0, 100);
        return {
          width: `${percent}%`,
          background: data.featureIconBackground || '#f97316'
        };
      }
      function reviewsSectionStyle(block) {
        return sectionBackgroundStyle(block?.data || {}, '#fff7ed');
      }
      function reviewsOverlayStyle(block) {
        return sectionOverlayStyle(block?.data || {});
      }
      function reviewsHeaderStyle(block) {
        const data = block?.data || {};
        const textAlign = data.textAlign || 'center';
        return {
          textAlign,
          maxWidth: asCssSize(data.descriptionMaxWidth, '640px'),
          margin: textAlign === 'left' ? '0' : '0 auto'
        };
      }
      function reviewsHeadingStyle(block) {
        const data = block?.data || {};
        return {
          color: data.headingColor || '#111827',
          fontSize: data.headingFontSize || '36px',
          fontWeight: data.headingFontWeight || '700',
          fontFamily: data.headingFontFamily || 'inherit'
        };
      }
      function reviewsDescriptionStyle(block) {
        return { color: block?.data?.descriptionColor || '#4b5563', fontSize: block?.data?.descriptionFontSize || '18px' };
      }
      function reviewsGridStyle(block) {
        const data = block?.data || {};
        const cols = clampNumber(Number(data.columns) || 3, 1, 4);
        return {
          gap: '24px',
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
        };
      }
      function reviewsCardStyle(block) {
        const data = block?.data || {};
        return {
          background: data.cardBackground || '#ffffff',
          color: data.cardTextColor || '#1f2937',
          padding: '24px',
          borderRadius: asCssSize(data.cardBorderRadius, '24px'),
          boxShadow: data.cardShadow || '0 16px 40px rgba(15,23,42,0.08)',
          border: data.cardBorderColor ? `1px solid ${data.cardBorderColor}` : 'none'
        };
      }
      function reviewsAvatarStyle(block) {
        const data = block?.data || {};
        const background = data.avatarBackground || '#f97316';
        let radius = '9999px';
        if (data.avatarShape === 'rounded') {
          radius = '20px';
        } else if (data.avatarShape === 'square') {
          radius = '12px';
        }
        return {
          width: '48px',
          height: '48px',
          borderRadius: radius,
          background,
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '600'
        };
      }
      function reviewsCardTitleStyle(block) {
        return { color: block?.data?.cardTextColor || '#1f2937' };
      }
      function reviewsCardSubtitleStyle(block) {
        return { color: (block?.data?.cardTextColor || '#1f2937') + '99' };
      }
      function reviewsRatingStyle(block) {
        return { color: block?.data?.ratingColor || '#facc15' };
      }
      function reviewsQuoteStyle(block) {
        return { color: block?.data?.cardQuoteColor || '#4b5563' };
      }
      function mapSectionStyle(block) {
        return sectionBackgroundStyle(block?.data || {}, '#ffffff');
      }
      function mapOverlayStyle(block) {
        return sectionOverlayStyle(block?.data || {});
      }
      function mapFrameStyle(block) {
        const data = block?.data || {};
        return {
          height: asCssSize(data.mapHeight, '380px'),
          borderRadius: asCssSize(data.mapBorderRadius, '24px'),
          boxShadow: data.mapShadow || '0 20px 45px rgba(15,23,42,0.08)',
          overflow: 'hidden'
        };
      }
      function mapIframeStyle(block) {
        return {
          width: '100%',
          height: '100%',
          border: '0'
        };
      }
      function mapInfoCardStyle(block) {
        const data = block?.data || {};
        return {
          background: data.cardBackground || 'rgba(255,255,255,0.92)',
          color: data.cardTextColor || '#1f2937',
          borderRadius: asCssSize(data.cardBorderRadius, '24px'),
          boxShadow: data.cardShadow || '0 18px 40px rgba(15,23,42,0.08)',
          padding: '24px'
        };
      }
      function mapHeadingStyle(block) {
        const data = block?.data || {};
        return {
          color: data.headingColor || '#111827',
          fontSize: data.headingFontSize || '32px',
          fontWeight: data.headingFontWeight || '700',
          fontFamily: data.headingFontFamily || 'inherit'
        };
      }
      function mapDescriptionStyle(block) {
        return { color: block?.data?.descriptionColor || '#4b5563', fontSize: block?.data?.descriptionFontSize || '18px' };
      }
      function mapContactRowStyle(block) {
        const data = block?.data || {};
        return {
          color: data.contactTextColor || '#4b5563',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        };
      }
      function mapContactIconStyle(block) {
        return { color: block?.data?.contactIconColor || '#f97316' };
      }
      function heroWrapperStyle(block) {
        const data = block.data || {};
        const layout = data.layout || 'split';
        const heightValue = layout === 'freeform'
          ? asCssSize(data.freeformHeight || data.minHeight, '640px')
          : asCssSize(data.minHeight, '560px');
        return {
          minHeight: heightValue,
          padding: `${asCssSize(data.contentPaddingY, '120px')} ${asCssSize(data.contentPaddingX, '96px')}`,
          position: 'relative'
        };
      }
      function heroBackgroundStyle(block) {
        const data = block.data || {};
        const image = data.backgroundImage ? `url(${data.backgroundImage})` : 'none';
        return {
          backgroundImage: image,
          backgroundPosition: data.backgroundPosition || 'center center',
          backgroundSize: data.backgroundSize || 'cover',
          backgroundRepeat: data.backgroundRepeat || 'no-repeat'
        };
      }
      function heroOverlayStyle(block) {
        const data = block.data || {};
        const styles = {
          background: data.overlayColor || 'rgba(17, 24, 39, 0.55)'
        };
        const blurValue = parseFloat(data.overlayBlur);
        if (!Number.isNaN(blurValue) && blurValue > 0) {
          styles.backdropFilter = `blur(${blurValue}px)`;
        }
        return styles;
      }
      function heroContainerClasses(block) {
        const data = block.data || {};
        const layout = data.layout || 'split';
        if (layout === 'split') {
          const classes = ['relative', 'grid', 'items-center', 'w-full'];
          if (data.showRightImage) {
            classes.push('lg:grid-cols-2');
          } else {
            classes.push('grid-cols-1');
          }
          return classes.join(' ');
        }
        if (layout === 'freeform') {
          return 'relative flex flex-col w-full';
        }
        return 'relative flex flex-col items-center w-full';
      }
      function heroContainerStyle(block) {
        const data = block.data || {};
        const layout = data.layout || 'split';
        if (layout === 'freeform') {
          return {
            gap: '0px',
            position: 'relative',
            width: '100%'
          };
        }
        return {
          gap: asCssSize(data.contentGap, '40px')
        };
      }
      function heroContentColumnClasses(block) {
        const data = block.data || {};
        const layout = data.layout || 'split';
        if (layout === 'freeform') {
          return 'relative w-full min-h-[320px]';
        }
        const classes = ['space-y-4', 'w-full'];
        if (layout === 'split') {
          classes.push('text-left');
          if (data.imageSide === 'left' && data.showRightImage) {
            classes.push('lg:order-2');
          }
        } else {
          classes.push('mx-auto', 'text-center');
          if (layout === 'spotlight') {
            classes.push('order-2');
          }
        }
        return classes.join(' ');
      }
      function heroContentStyle(block) {
        const data = block.data || {};
        const style = {
          maxWidth: asCssSize(data.contentMaxWidth, '620px'),
          width: '100%'
        };
        if (data.layout === 'freeform') {
          style.position = 'relative';
          style.minHeight = asCssSize(data.freeformHeight || data.minHeight, '640px');
        } else if (data.layout && data.layout !== 'split') {
          style.marginLeft = 'auto';
          style.marginRight = 'auto';
        }
        return style;
      }
      function heroMediaWrapperClasses(block) {
        const data = block.data || {};
        if (!data.showRightImage) {
          return 'hidden';
        }
        const layout = data.layout || 'split';
        if (layout === 'freeform') {
          return 'hidden';
        }
        if (layout === 'split') {
          const classes = ['hidden', 'lg:flex', 'items-center', 'justify-center'];
          if (data.imageSide === 'left') {
            classes.push('lg:order-1');
          }
          return classes.join(' ');
        }
        if (layout === 'spotlight') {
          return 'flex justify-center order-1 w-full mb-10';
        }
        return 'flex justify-center w-full mt-10';
      }
      function heroFeatureIconWrapperStyle(element) {
        const data = element.data || {};
        let borderRadius = '9999px';
        if (data.iconShape === 'square') {
          borderRadius = '12px';
        } else if (data.iconShape === 'rounded') {
          borderRadius = '18px';
        }
        return {
          backgroundColor: data.iconBackground || 'rgba(249, 115, 22, 0.12)',
          color: data.iconColor || '#f97316',
          borderRadius
        };
      }
      function asCssSize(value, fallback) {
        if (value === null || value === undefined) {
          return fallback;
        }
        const trimmed = String(value).trim();
        if (!trimmed) {
          return fallback;
        }
        if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
          return `${trimmed}px`;
        }
        return trimmed;
      }
      function parseCssNumber(value, fallback = 0) {
        if (value === null || value === undefined) {
          return fallback;
        }
        const match = String(value).match(/-?\d+(\.\d+)?/);
        return match ? Number(match[0]) : fallback;
      }
      function clampNumber(value, min, max) {
        if (!Number.isFinite(value)) {
          return min;
        }
        if (value < min) {
          return min;
        }
        if (value > max) {
          return max;
        }
        return value;
      }

  window.SiteBuilderStyles = {
    heroImageProps,
    sectionBackgroundStyle,
    sectionOverlayStyle,
    blockButtonWrapperStyle,
    blockButtonClass,
    blockButtonStyle,
    categoriesSectionStyle,
    categoriesOverlayStyle,
    categoriesHeaderStyle,
    categoriesHeadingStyle,
    categoriesSubheadingStyle,
    categoriesDescriptionStyle,
    categoriesGridStyle,
    categoriesCardStyle,
    categoriesIconWrapperStyle,
    categoriesCardTitleStyle,
    categoriesCardDescriptionStyle,
    menuSectionStyle,
    menuOverlayStyle,
    menuHeaderStyle,
    menuHeadingStyle,
    menuDescriptionStyle,
    menuFilterSurfaceStyle,
    menuTabsWrapperStyle,
    menuActiveTabStyle,
    menuTabStyle,
    menuGridStyle,
    menuCardStyle,
    menuCardImageStyle,
    menuCardTitleStyle,
    menuCardDescriptionStyle,
    menuPriceStyle,
    menuTagStyle,
    deliverySectionStyle,
    deliveryOverlayStyle,
    deliveryTextColumnStyle,
    deliveryHeadingStyle,
    deliveryDescriptionStyle,
    deliveryFeatureIconStyle,
    deliveryFeatureTextStyle,
    deliveryContactsStyle,
    deliveryTrackingCardStyle,
    deliveryTrackingBarStyle,
    deliveryTrackingTitleStyle,
    deliveryTrackingDescriptionStyle,
    deliveryTrackingProgressStyle,
    reviewsSectionStyle,
    reviewsOverlayStyle,
    reviewsHeaderStyle,
    reviewsHeadingStyle,
    reviewsDescriptionStyle,
    reviewsGridStyle,
    reviewsCardStyle,
    reviewsAvatarStyle,
    reviewsCardTitleStyle,
    reviewsCardSubtitleStyle,
    reviewsRatingStyle,
    reviewsQuoteStyle,
    mapSectionStyle,
    mapOverlayStyle,
    mapFrameStyle,
    mapIframeStyle,
    mapInfoCardStyle,
    mapHeadingStyle,
    mapDescriptionStyle,
    mapContactRowStyle,
    mapContactIconStyle,
    heroWrapperStyle,
    heroBackgroundStyle,
    heroOverlayStyle,
    heroContainerClasses,
    heroContainerStyle,
    heroContentColumnClasses,
    heroContentStyle,
    heroMediaWrapperClasses,
    heroFeatureIconWrapperStyle,
    asCssSize,
    parseCssNumber,
    clampNumber
  };
})();
