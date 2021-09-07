import { SubstrateExtrinsic } from "@subql/types";
import { Sale } from "../types";

export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {
  const record = new Sale(extrinsic.block.block.header.hash.toString()); // TODO: not correct
  const call = extrinsic.extrinsic.method.args[0][0] as any;
  if (
    call.section === "system" &&
    call.method === "remark" &&
    call.args
      .toString()
      .startsWith(
        "RMRK::BUY::1.0.0::7479313-7a147cba01afccbf17-GA-GENERATIVE_ASTERISM_"
      )
  ) {
    record.nftN = parseInt(call.args.toString().slice(-3), 10);
    await record.save();
  }
}
