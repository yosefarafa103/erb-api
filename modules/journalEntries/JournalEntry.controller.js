import JournalEntry from "./JournalEntry.model.js";
import JournalLine from "./JournalLine.model.js";

export const createJournalEntry = async (req, res) => {
  try {
    const { lines, description, reference } = req.body;
    if (!lines || lines.length < 2) {
      return res.status(400).json({ message: "At least 2 lines required" });
    }
    const totalDebit = lines.reduce((sum, l) => sum + (l.debit || 0), 0);
    const totalCredit = lines.reduce((sum, l) => sum + (l.credit || 0), 0);
    if (totalDebit !== totalCredit) {
      return res.status(400).json({ message: "Debit must equal credit" });
    }
    const entry = await JournalEntry.create({
      tenantId: req.user.lastActiveTenant,
      description,
      reference,
      createdBy: req.user._id,
    });
    const linesToInsert = lines.map((l) => ({
      ...l,
      journalEntryId: entry._id,
    }));
    await JournalLine.insertMany(linesToInsert);
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getJournalEntries = async (req, res) => {
  try {
    const entries = await JournalEntry.find({
      tenantId: req.user.lastActiveTenant,
    }).sort({ createdAt: -1 });

    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getJournalEntryById = async (req, res) => {
  try {
    const entry = await JournalEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Not found" });
    }

    const lines = await JournalLine.find({
      journalEntryId: entry._id,
    }).populate("accountId");

    res.json({ entry, lines });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const reverseJournalEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Not found" });
    }

    const lines = await JournalLine.find({
      journalEntryId: entry._id,
    });

    const reversed = await JournalEntry.create({
      tenantId: entry.tenantId,
      description: `Reversal of ${entry._id}`,
      sourceType: "reversal",
      createdBy: req.user._id,
    });

    const reversedLines = lines.map((l) => ({
      journalEntryId: reversed._id,
      accountId: l.accountId,
      debit: l.credit,
      credit: l.debit,
    }));

    await JournalLine.insertMany(reversedLines);

    entry.status = "reversed";
    await entry.save();

    res.json({ message: "Entry reversed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
