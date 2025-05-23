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
        sectionType?: 'chapter' | 'part' | 'section';
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
        default: 'Section',
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
      sectionType: {
        default: 'chapter',
        parseHTML: element => element.getAttribute('data-type') || 'chapter',
        renderHTML: attributes => {
          return {
            'data-type': attributes.sectionType || 'chapter',
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'section[data-type="chapter"]',
      },
      {
        tag: 'section[data-type="part"]',
      },
      {
        tag: 'section[data-type="section"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'section',
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
            title = 'Section',
            sectionType = 'chapter'
          } = attributes || {};
          const html = `<section data-type="${sectionType}" id="${id}" data-title="${title}"><p>Section content goes here...</p></section>`;
          return commands.insertContent(html);
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-s': () => this.editor.commands.setSection(),
    };
  },
});
