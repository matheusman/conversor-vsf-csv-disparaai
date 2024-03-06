import fs from "fs";
import sourcePath from "path";
import readline from "readline";

export class ArrContato {
  contato: string[];

  constructor(arr: string[]) {
    this.contato = arr;
  }
}

class FileSystem {
  ArrContato: ArrContato[];
  begin: string;
  end: string;
  sourcePath: string;
  confirm: boolean;
  contact: string[];

  constructor() {
    this.sourcePath = sourcePath.join(__dirname, "..", "./index.txt");
    this.confirm = false;
    this.begin = "BEGIN";
    this.end = "END";
    this.contact = [];
    this.ArrContato = [];
  }

  async ReadFile() {
    const leitor = readline.createInterface({
      input: fs.createReadStream(this.sourcePath),
      output: process.stdout,
      terminal: false,
    });
    leitor.on("line", (line) => {
      if (line.indexOf(this.begin) !== -1) {
        this.confirm = true;
      }

      if (this.confirm) {
        this.contact.push(line);
      }

      if (line.indexOf(this.end) !== -1) {
        this.ArrContato.push(new ArrContato(this.contact));
        this.contact = [];
        this.confirm = false;
      }
    });

    return new Promise((resolve, reject) => {
      leitor.on("close", () => {
        console.log("Leitura concluída");
        resolve(this.ArrContato);
      });
      leitor.on("error", (err) => {
        reject(err);
      });
    });
  }
}

class CreateFileJson extends FileSystem {
  async GenerateJson() {
    try {
      const contato = await this.ReadFile();
      if (contato) {
        const json = JSON.stringify(contato, null, 2);
        fs.writeFile("./contatos.json", json, "utf-8", (err) => {
          if (err) {
            throw new Error("Houve um error na hora da conversão do arquivo");
          } else {
            console.log("json criado com sucesso");
          }
        });
      } else {
        throw new Error("Houve um error na hora de ler um arquivo");
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  }
}

const createFileJson = new CreateFileJson();
createFileJson.GenerateJson();