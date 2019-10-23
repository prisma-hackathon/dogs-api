import { Photon } from '@generated/photon'
const photon = new Photon()

async function main() {
  await photon.attributeTemplates.create({
    data: {
      choices: {
        set: ['yipper', 'yorker', 'borker', 'boofer', 'woofer', 'yoofer']
      },
      name: 'bark',
      description: '![bork chart](https://i.kym-cdn.com/photos/images/original/001/349/438/c48.jpg)'
    }
  })

  await photon.attributeTemplates.create({
    data: {
      choices: {
        set: ['A Fine Boi', 'He Chomnk', 'A Heckin\' Chonker', 'H E F T Y C H O N K', 'M E G A C H O N K E R', 'OH LAWD HE COMIN']
      },
      name: 'chonk',
      description: '![chonk chart](https://i.imgur.com/sNqNi9E.png)'
    }
  })

  await photon.attributeTemplates.create({
    data: {
      choices: {
        set: ['doggo', 'pupper', 'pupperino', 'floof']
      },
      name: 'frenType',
      description: 'pretty self-explanatory',
    },
  })
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await photon.disconnect()
  })
