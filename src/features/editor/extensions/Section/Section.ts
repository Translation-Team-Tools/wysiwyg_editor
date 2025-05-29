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

  content: 'block*',  // Changed from 'block+' to 'block*' to allow empty sections

  defining: true,

  isolating: true,    // Prevents unwanted splitting

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
        parseHTML: element => element.getAttribute('data-toc-title'),
        renderHTML: attributes => {
          if (!attributes.title) {
            return {};
          }
          return {
            'data-toc-title': attributes.title,
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
        tag: 'section[data-toc-title]',
      },
      {
        tag: 'div[data-toc-title]',
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
          const html = `<${htmlTagName} id="${id}" data-toc-title="${title}"><p></p></${htmlTagName}>`;
          
          return commands.insertContent(html);
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-s': () => this.editor.commands.setSection({ tagName: 'section' }),
      'Mod-Shift-d': () => this.editor.commands.setSection({ tagName: 'div' }),
      
      // Custom Enter handling to prevent unwanted exits
      'Enter': ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;
        
        // Check if we're in a section
        const section = $from.node(-1);
        if (section.type.name === 'section') {
          // Check if current paragraph is empty
          const currentParagraph = $from.parent;
          if (currentParagraph.type.name === 'paragraph' && currentParagraph.content.size === 0) {
            // Check if this is the second consecutive empty paragraph
            const prevNode = $from.nodeBefore;
            if (prevNode && prevNode.type.name === 'paragraph' && prevNode.content.size === 0) {
              // Exit the section only if user explicitly wants to (triple Enter)
              const beforePrevNode = state.doc.resolve($from.pos - prevNode.nodeSize - 1).nodeBefore;
              if (beforePrevNode && beforePrevNode.type.name === 'paragraph' && beforePrevNode.content.size === 0) {
                // Triple enter - exit the section
                return editor.commands.exitCode();
              }
            }
          }
        }
        
        // Default behavior for normal Enter
        return false;
      },
      
      // Allow explicit exit with Mod+Enter
      'Mod-Enter': ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;
        
        // Check if we're in a section
        const section = $from.node(-1);
        if (section.type.name === 'section') {
          return editor.commands.exitCode();
        }
        
        return false;
      },
      
      // Handle backspace at the beginning of empty sections
      'Backspace': ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;
        
        // Only handle if cursor is at the very beginning of a paragraph in a section
        if ($from.parentOffset === 0) {
          const section = $from.node(-1);
          if (section.type.name === 'section') {
            const currentParagraph = $from.parent;
            // If it's an empty paragraph and it's the only content in the section
            if (currentParagraph.type.name === 'paragraph' && 
                currentParagraph.content.size === 0 && 
                section.content.size <= 2) { // Empty paragraph has size ~2
              // Remove the entire section
              const sectionPos = $from.pos - $from.parentOffset - 1;
              editor.commands.deleteRange({ from: sectionPos, to: sectionPos + section.nodeSize });
              return true;
            }
          }
        }
        
        return false;
      }
    };
  },
});