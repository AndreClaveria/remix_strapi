import type { Schema, Struct } from '@strapi/strapi';

export interface ComponentsCallToAction extends Struct.ComponentSchema {
  collectionName: 'components_components_call_to_actions';
  info: {
    displayName: 'Call to Action';
    icon: 'cursor-pointer';
  };
  attributes: {
    backgroundColor: Schema.Attribute.Enumeration<
      ['blue', 'green', 'red', 'purple', 'gray']
    > &
      Schema.Attribute.DefaultTo<'blue'>;
    buttonLink: Schema.Attribute.String & Schema.Attribute.Required;
    buttonText: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComponentsHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_components_hero_sections';
  info: {
    displayName: 'Hero Section';
    icon: 'star';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'>;
    ctaLink: Schema.Attribute.String;
    ctaText: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComponentsImageGallery extends Struct.ComponentSchema {
  collectionName: 'components_components_image_galleries';
  info: {
    displayName: 'Image Gallery';
    icon: 'picture';
  };
  attributes: {
    images: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
    layout: Schema.Attribute.Enumeration<['grid', 'carousel', 'masonry']> &
      Schema.Attribute.DefaultTo<'grid'>;
    title: Schema.Attribute.String;
  };
}

export interface ComponentsTextBlock extends Struct.ComponentSchema {
  collectionName: 'components_components_text_blocks';
  info: {
    displayName: 'Text Block';
    icon: 'align-left';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<['left', 'center', 'right']> &
      Schema.Attribute.DefaultTo<'left'>;
    content: Schema.Attribute.RichText & Schema.Attribute.Required;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'components.call-to-action': ComponentsCallToAction;
      'components.hero-section': ComponentsHeroSection;
      'components.image-gallery': ComponentsImageGallery;
      'components.text-block': ComponentsTextBlock;
    }
  }
}
