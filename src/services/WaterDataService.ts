import fs from 'node:fs/promises';
import { WaterLogProps } from '../front/Kerosene/createWaterLog';

class WaterDataService {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async getWaterData(): Promise<{ [key: string]: WaterLogProps } | null> {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      throw new Error(
        `Error reading water data file: ${(err as Error).message}`
      );
    }
  }

  async saveWaterData(data: { [key: string]: WaterLogProps }): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(data), 'utf8');
  }
}

export default WaterDataService;
