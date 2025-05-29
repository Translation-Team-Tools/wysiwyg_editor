import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TextSelection } from '@tiptap/pm/state';
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
      exitSection: () => ReturnType;
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

  isolating: true,

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
      
      exitSection: () => ({ tr, state, dispatch }) => {
        const { selection } = state;
        const { $from } = selection;
        
        // Find the section node we're inside
        let sectionDepth = -1;
        let sectionPos = -1;
        
        for (let depth = $from.depth; depth > 0; depth--) {
          const node = $from.node(depth);
          if (node.type.name === 'section') {
            sectionDepth = depth;
            sectionPos = $from.start(depth) - 1;
            break;
          }
        }
        
        if (sectionDepth === -1) return false;
        
        // Get the section node to calculate its end position
        const sectionNode = $from.node(sectionDepth);
        const sectionEndPos = sectionPos + sectionNode.nodeSize;
        
        // Create a new paragraph after the section
        const paragraph = state.schema.nodes.paragraph.create();
        
        if (dispatch) {
          tr.insert(sectionEndPos, paragraph);
          const newPos = sectionEndPos + 1;
          const $newPos = tr.doc.resolve(newPos);
          tr.setSelection(TextSelection.near($newPos));
          dispatch(tr);
        }
        
        return true;
      },
    };
  },

  addKeyboardShortcuts() {
    // Helper function to determine section type
    const getSectionType = (sectionNode: any) => {
      const title = (sectionNode.attrs.title || '').toLowerCase();
      if (title.startsWith('chapter')) return 'chapter';
      if (title.startsWith('part')) return 'part';
      if (title.startsWith('container')) return 'container';
      return 'section';
    };

    return {
      'Mod-Shift-s': () => this.editor.commands.setSection({ tagName: 'section' }),
      'Mod-Shift-d': () => this.editor.commands.setSection({ tagName: 'div' }),
      
      'Enter': ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;
        
        // Find if we're in a section
        let sectionNode = null;
        for (let depth = $from.depth; depth > 0; depth--) {
          const node = $from.node(depth);
          if (node.type.name === 'section') {
            sectionNode = node;
            break;
          }
        }
        
        if (!sectionNode) return false;
        
        const sectionType = getSectionType(sectionNode);
        
        // Check if current paragraph is empty
        const currentParagraph = $from.parent;
        if (currentParagraph.type.name === 'paragraph' && currentParagraph.content.size === 0) {
          
          if (sectionType === 'container') {
            // For containers: double Enter to exit
            const prevNode = $from.nodeBefore;
            if (prevNode && prevNode.type.name === 'paragraph' && prevNode.content.size === 0) {
              return editor.commands.exitSection();
            }
          } else if (sectionType === 'chapter' || sectionType === 'part') {
            // For chapters and parts: triple Enter to exit
            const prevNode = $from.nodeBefore;
            if (prevNode && prevNode.type.name === 'paragraph' && prevNode.content.size === 0) {
              const prevPrevPos = $from.pos - prevNode.nodeSize - 1;
              if (prevPrevPos > 0) {
                const beforePrevNode = state.doc.resolve(prevPrevPos).nodeBefore;
                if (beforePrevNode && beforePrevNode.type.name === 'paragraph' && beforePrevNode.content.size === 0) {
                  return editor.commands.exitSection();
                }
              }
            }
          } else {
            // For regular sections: double Enter to exit
            const prevNode = $from.nodeBefore;
            if (prevNode && prevNode.type.name === 'paragraph' && prevNode.content.size === 0) {
              return editor.commands.exitSection();
            }
          }
        }
        
        return false;
      },
      
      'Mod-Enter': ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;
        
        // Check if we're in a section
        for (let depth = $from.depth; depth > 0; depth--) {
          const node = $from.node(depth);
          if (node.type.name === 'section') {
            return editor.commands.exitSection();
          }
        }
        
        return false;
      },
      
      'Shift-Enter': ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;
        
        // Find if we're in a section
        for (let depth = $from.depth; depth > 0; depth--) {
          const node = $from.node(depth);
          if (node.type.name === 'section') {
            const sectionType = getSectionType(node);
            
            // Allow Shift+Enter to exit containers easily
            if (sectionType === 'container') {
              return editor.commands.exitSection();
            }
            break;
          }
        }
        
        return false;
      },
      
      'Backspace': ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;
        
        if ($from.parentOffset === 0) {
          for (let depth = $from.depth; depth > 0; depth--) {
            const node = $from.node(depth);
            if (node.type.name === 'section') {
              const currentParagraph = $from.parent;
              if (currentParagraph.type.name === 'paragraph' && 
                  currentParagraph.content.size === 0 && 
                  node.content.size <= 2) {
                const sectionPos = $from.start(depth) - 1;
                editor.commands.deleteRange({ from: sectionPos, to: sectionPos + node.nodeSize });
                return true;
              }
              break;
            }
          }
        }
        
        return false;
      }
    };
  },
});