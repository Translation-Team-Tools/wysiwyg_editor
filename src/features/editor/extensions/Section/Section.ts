import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { SectionNodeView } from './SectionNodeView';

export interface SectionOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    section: {
      setSection: (attributes?: { 
        id?: string; 
        title?: string; 
        tagName?: 'section' | 'div';
      }) => ReturnType;
    };
  }
}

export const SectionExtension = Node.create<SectionOptions>({
  name: 'section',

  priority: 1000,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  group: 'block',

  content: 'block*',

  defining: true,

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('id'),
        renderHTML: attributes => {
          if (!attributes.id) {
            return {};
          }
          return {
            id: attributes.id,
          };
        },
      },
      title: {
        default: 'Untitled',
        parseHTML: element => element.getAttribute('data-title'),
        renderHTML: attributes => {
          if (!attributes.title) {
            return {};
          }
          return {
            'data-title': attributes.title,
          };
        },
      },
      tagName: {
        default: 'section',
        parseHTML: element => {
          return element.tagName.toLowerCase() === 'div' ? 'div' : 'section';
        },
        renderHTML: attributes => {
          // This attribute is used internally but not rendered to HTML
          return {};
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'section[data-title]',
      },
      {
        tag: 'div[data-title]',
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const tagName = node.attrs.tagName || 'section';
    return [
      tagName,
      mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(SectionNodeView);
  },

  addCommands() {
    return {
      setSection:
        (attributes) =>
        ({ commands }) => {
          const { 
            id = `section${Date.now()}`, 
            title = 'Untitled',
            tagName = 'section'
          } = attributes || {};
          
          const htmlTagName = tagName === 'div' ? 'div' : 'section';
          const html = `<${htmlTagName} id="${id}" data-title="${title}"><p>Content goes here...</p></${htmlTagName}>`;
          
          return commands.insertContent(html);
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-s': () => this.editor.commands.setSection({ tagName: 'section' }),
      'Mod-Shift-d': () => this.editor.commands.setSection({ tagName: 'div' }),
    };
  },
});