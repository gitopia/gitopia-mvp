const appQuery = address => ({
  op: "and",
  expr1: {
    op: "equals",
    expr1: "App-Name",
    expr2: "dgit"
  },
  expr2: {
    op: "equals",
    expr1: "from",
    expr2: address
  }
})

export const txQuery = (address, txType) => ({
  op: "and",
  expr1: appQuery(address),
  expr2: { op: "equals", expr1: "Type", expr2: txType }
})

export const getAllActivities = async (arweave, address) => {
  const txids = await arweave.arql(appQuery(address))
  const activities = await Promise.all(
    txids.map(async txid => {
      let activity = {}
      activity.txid = txid
      try {
        const tx = await arweave.transactions.get(txid)

        tx.get("tags").forEach(tag => {
          const key = tag.get("name", { decode: true, string: true })
          const value = tag.get("value", { decode: true, string: true })
          if (key === "Unix-Time") activity.unixTime = value
          else if (key === "Type") activity.type = value
          else if (key === "ref") activity.key = value
          else if (key === "Repo") activity.repoName = value
        })

        if (activity.type === "update-ref")
          activity.value = tx.get("data", { decode: true, string: true })
        else if (activity.type === "create-repo") {
          const data = tx.get("data", { decode: true, string: true })
          const decoded = JSON.parse(data)
          activity.key = decoded.name
          activity.value = decoded.description
        }
      } catch (error) {}
      return activity
    })
  )

  const filteredActivities = activities.filter(activity =>
    ["create-repo", "update-ref"].includes(activity.type)
  )
  filteredActivities.sort((a, b) => {
    Number(b.unixTime) - Number(a.unixTime)
  })

  return filteredActivities
}
