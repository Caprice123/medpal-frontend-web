// Custom slash menu item for Embed block
export const insertEmbed = (editor) => {
  const currentBlock = editor.getTextCursorPosition().block;
  const embedBlock = {
    type: "embed",
    props: {
      url: "",
      height: 480,
    },
  };

  editor.insertBlocks([embedBlock], currentBlock, "after");
};
