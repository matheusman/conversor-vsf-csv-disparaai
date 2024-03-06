import fs from "fs";
import sourcePath from "path";
import { ArrContato } from ".";

class FileCsv {
  path: string;
  cell: string;
  name: string;
  Contato: Contato[];
  sourcePathFile: string;
  endString: string;

  constructor() {
    this.path = sourcePath.join(__dirname, "..", "contatos.json");
    this.sourcePathFile = sourcePath.join(__dirname, "..", "contatos.csv");
    this.cell = "TEL;CELL:";
    this.name = "FN:";
    this.endString = `"nome","telefone"`;
    this.Contato = [];
    this.ReadJson().then( () => {
      this.AddCsv()
    })
  }

  async ReadJson() {
    return new Promise<void>( (resolve, rejected) => fs.readFile(this.path, "utf-8", (err, data) => {
      try {
        if (err) {
          throw new Error(err.message);
        }

        const contatos = JSON.parse(data) as ArrContato[];
        const mapContatos = contatos.map((item) => {
          const test = item.contato.filter(
            (letter) =>
              letter.indexOf(this.cell) !== -1 ||
              letter.indexOf(this.name) !== -1
          );
          return test;
        });
        const contatoFilterEnd = mapContatos
          .filter((contato) => contato.length > 1)
          .map((contato) => {
            return contato.map((contatoFilter) => {
              if (contatoFilter.indexOf(this.name) !== -1) {
                return this.RemoveLetterName(contatoFilter);
              }
              if (contatoFilter.indexOf(this.cell) !== -1) {
                const num = this.RemoveLetterNumber(contatoFilter);
                if (num !== undefined) {
                  return num;
                }
              }
            });
          });
        const contatoFinalThruthEnd = contatoFilterEnd
          .map((item) => {
            return item.filter((contato) => contato);
          })
          .filter((item) => item.length > 1);

        contatoFinalThruthEnd.forEach((item) => {
          if (item[0] && item[0]?.indexOf("55") === -1) {
            if (item[1] && item[1]?.indexOf("55") !== -1) {
              this.Contato.push(new Contato(item[0], item[1]));
            }
          }
        })
        resolve();
      } catch (err) {
        if (err instanceof Error) {
          rejected(err)
        }
      }
    }))
  }

  private RemoveLetterName(name: string) {
    return name.substring(3);
  }

  private RemoveLetterNumber(numberCell: string) {
    const number = numberCell.substring(10);
    if (number.indexOf("55") === -1) {
      return;
    } else {
      return number;
    }
  }

  async AddCsv() {
    this.ConverterString()
    fs.writeFile(this.sourcePathFile, this.endString , (err) => {
      if (err) {
        console.log(err)
      }
    })
  }

  public ConverterString() {
    this.Contato.forEach((item) => this.endString += `\n"${item.name}","${item.number}"`);
  }
}

class Contato {
  public name: string;
  public number: string;

  constructor(name: string, number: string) {
    this.name = name;
    this.number = number;
  }
}

const fileCsv = new FileCsv();
