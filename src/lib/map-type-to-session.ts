import { SoalUTBKType } from "../../generated/prisma/enums";

export function MapTypeToSesi(type: SoalUTBKType) {
	switch (type) {
		case SoalUTBKType.PU:
		case SoalUTBKType.PBM:
		case SoalUTBKType.PPU:
		case SoalUTBKType.PK:
			return "TPS";

		case SoalUTBKType.LITERASIBINDO:
		case SoalUTBKType.LITERASIBINGG:
			return "LITERASI";

		default:
			throw new Error("Tipe soal tidak dikenali");
	}
}
