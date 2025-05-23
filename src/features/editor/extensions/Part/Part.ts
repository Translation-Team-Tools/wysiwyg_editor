import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { PartNodeView } from './PartNoveView';

export interface PartOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    part: {
      setPart: (attributes?: { id?: string; title?: string }) => ReturnType;
      togglePart: (attributes?: { id?: string; title?: string }) => ReturnType;
    };
  }
}

export const PartExtension = Node.create<PartOptions>({
  name: 'part',

  priority: 999,

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
        default: 'Part',
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
    };
  },

  parseHTML() {
    return [
      {
        tag: 'section[data-type="part"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'section',
      mergeAttributes(
        { 'data-type': 'part' },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PartNodeView);
  },

  addCommands() {
    return {
      setPart:
        (attributes) =>
        ({ commands }) => {
          const { id = `pt${Date.now()}`, title = 'Part' } = attributes || {};
          const html = `<section data-type="part" id="${id}" data-title="${title}"><p>Part content goes here...</p></section>`;
          return commands.insertContent(html);
        },
      togglePart:
        (attributes) =>
        ({ commands }) => {
          return commands.toggleNode(this.name, 'paragraph', attributes);
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-p': () => this.editor.commands.setPart(),
    };
  },
});
