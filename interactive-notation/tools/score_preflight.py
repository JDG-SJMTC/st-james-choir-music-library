#!/usr/bin/env python3
"""Evidence-only PDF preflight; never guesses staff boundaries or glyph anchors."""
import argparse, hashlib, json
from pathlib import Path
import fitz

def audit(pdf, manifest):
    source=manifest['stanzas']
    issues=[]
    for s in source:
        text='\n'.join(s['lines'])
        if hashlib.sha256(text.encode('utf-8')).hexdigest()!=s['sha256_utf8']:
            issues.append(f"stanza {s['number']}: locked text hash mismatch")
    doc=fitz.open(pdf)
    pages=[]
    for i,p in enumerate(doc):
        blocks=p.get_text('dict')['blocks']
        imgs=[]
        for item in p.get_images(full=True):
            xref=item[0]
            imgs.append({'pixel_width':item[2],'pixel_height':item[3],
                'page_rects':[[round(v,2) for v in rect] for rect in p.get_image_rects(xref)]})
        legacy=sorted({span['font'] for b in blocks if b['type']==0
                       for line in b['lines'] for span in line['spans'] if span['font'].startswith('TT')})
        pages.append({'page':i+1,'size_pt':[round(p.rect.width,2),round(p.rect.height,2)],
            'raster_images':imgs,'legacy_fonts':legacy,
            'extracted_text_reliable_for_malayalam':not bool(legacy)})
        if legacy: issues.append(f'page {i+1}: legacy Malayalam font extraction cannot be trusted')
    issues.extend(['No independently verified per-stanza staff-system boundaries',
                   'No independently verified Malayalam glyph-to-Manglish syllable map',
                   'No musical sign-off'])
    return {'song':manifest['song'],'status':'BLOCKED_FOR_ALIGNMENT',
        'source_integrity':'PASS' if not any('hash mismatch' in x for x in issues) else 'FAIL',
        'source_stanzas':len(source),'source_lines':sum(len(s['lines']) for s in source),
        'pdf_sha256':hashlib.sha256(Path(pdf).read_bytes()).hexdigest(),
        'pages':pages,'blockers':issues,'ready_for_overlay':False}

if __name__=='__main__':
    ap=argparse.ArgumentParser()
    ap.add_argument('--pdf',required=True)
    ap.add_argument('--manifest',required=True)
    ap.add_argument('--output',required=True)
    args=ap.parse_args()
    report=audit(args.pdf,json.loads(Path(args.manifest).read_text(encoding='utf-8')))
    Path(args.output).write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    print(json.dumps({'status':report['status'],'source_integrity':report['source_integrity'],
                      'blockers':report['blockers']},indent=2))
