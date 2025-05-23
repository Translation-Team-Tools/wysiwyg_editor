import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ChapterNodeView } from './ChapterNodeView';

export interface ChapterOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    chapter: {
      setChapter: (attributes?: { id?: string; title?: string }) => ReturnType;
      toggleChapter: (attributes?: { id?: string; title?: string }) => ReturnType;
    };
  }
}

export const ChapterExtension = Node.create<ChapterOptions>({
  name: 'chapter',

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
        default: 'Chapter',
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
        tag: 'section[data-type="chapter"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'section',
      mergeAttributes(
        { 'data-type': 'chapter' },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ChapterNodeView);
  },

  addCommands() {
    return {
      setChapter:
        (attributes) =>
        ({ commands }) => {
          const { id = `ch${Date.now()}`, title = 'Chapter' } = attributes || {};
          const html = `<section data-type="chapter" id="${id}" data-title="${title}"><p>Chapter content goes here...</p></section>`;
          return commands.insertContent(html);
        },
      toggleChapter:
        (attributes) =>
        ({ commands }) => {
          return commands.toggleNode(this.name, 'paragraph', attributes);
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-c': () => this.editor.commands.setChapter(),
    };
  },
});
