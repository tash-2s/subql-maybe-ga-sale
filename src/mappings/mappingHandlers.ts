import { SubstrateExtrinsic } from "@subql/types";
import { Sale } from "../types";

export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {
  const call = extrinsic.extrinsic.method.args[0][0] as any;
  if (
    call.section === "system" &&
    call.method === "remark" &&
    call.args.toString().startsWith("0x524d524b")
  ) {
    const str = Buffer.from(
      call.args.toString().replace(/^0x/, ""),
      "hex"
    ).toString();
    if (
      str.startsWith(
        "RMRK::BUY::1.0.0::7479313-7a147cba01afccbf17-GA-GENERATIVE_ASTERISM_"
      )
    ) {
      const id = `${extrinsic.block.block.header.hash.toString()}-${
        extrinsic.idx
      }`;
      const nftN = parseInt(str.slice(-3), 10);
      logger.info(`found: ${id}, ${nftN}`);
      const record = new Sale(id);
      record.nftN = nftN;
      await record.save();
    }
  }
}
