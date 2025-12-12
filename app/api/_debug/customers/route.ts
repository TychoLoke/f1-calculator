import { NextResponse } from 'next/server';
import { listFolderContents, exportRoot } from '../../../../lib/elements/files';
import { getCustomers } from '../../../../lib/elements/fixtures';

export async function GET() {
  const result = getCustomers();
  const { items: customers, errors, exportPath, contents } = result;

  if (!customers.length) {
    const expectedPath = exportPath ?? `${exportRoot}/customers.batch.json`;
    return NextResponse.json({
      customers,
      errors: errors.length ? errors : ['No customers were returned from the fixtures.'],
      expectedPath,
      exportRoot,
      exportContents: contents ?? listFolderContents(),
    });
  }

  return NextResponse.json({
    customers,
    errors,
    exportPath: exportPath ?? `${exportRoot}/customers.batch.json`,
  });
}
