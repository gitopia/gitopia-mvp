export const txQuery = (address, txType) => ({
  op: "and",
  expr1: {
    op: "and",
    expr1: {
      op: "equals",
      expr1: "App-Name",
      expr2: "test-repo"
    },
    expr2: {
      op: "equals",
      expr1: "from",
      expr2: address
    }
  },
  expr2: { op: "equals", expr1: "Type", expr2: txType }
})
