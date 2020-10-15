import axios from "axios"
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

const api = axios.create({
  baseURL: "https://arweave.dev"
})

export const getAllActivities = async (arweave, address) => {
  try {
    const activities = await api.post("/graphql", {
      query: `query {
          transactions(owners:["${address}"],tags: [
        
                      {
                        name: "App-Name",
                        values: "dgit"
                      },
                      {
                        name: "version",
                        values: "0.0.1"
                      }
                    ]) {
            pageInfo {
              hasNextPage
            }
            edges {
              cursor
              node {
                id
                tags {
                  name,
                  value
                }
              }
            }
          }
        }`
    })

    // const tx = await arweave.transactions.get(txid)
    let actobj = {}
    let objects = activities.data.data.transactions.edges.map(activity => {
      actobj = {}
      actobj.txid = activity.node.id
      activity.node.tags.forEach(tag => {
        const key = tag.name
        const value = tag.value
        if (key === "Unix-Time") {
          actobj.unixTime = value
        } else if (key === "Type") {
          actobj.type = value
        } else if (key === "ref") {
          actobj.key = value
        } else if (key === "Repo") {
          actobj.repoName = value
        }
      })

      // if (actobj.type === "update-ref") {
      //   actobj.value = tx.get("data", { decode: true, string: true })
      // } else if (actobj.type === "create-repo") {
      //   const data = tx.get("data", { decode: true, string: true })
      //   const decoded = JSON.parse(data)
      //   actobj.key = decoded.name
      //   actobj.value = decoded.description
      // }
      console.log(actobj)
      return actobj
    })

    // const filteredActivities = objects.filter(activity =>
    //   ["create-repo", "update-ref"].includes(activity.type)
    // )
    // filteredActivities.sort((a, b) => {
    //   return Number(b.unixTime) - Number(a.unixTime)
    // })
    console.log(objects)
    return objects
  } catch (error) {
    console.log(error)
  }
}
